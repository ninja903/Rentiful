// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const role = unsafe_metadata.role as "tenant" | "manager" | undefined;

    if (!role) {
      console.error(`User ${id} created without a role in metadata.`);
      return new Response("User role not found in metadata", { status: 400 });
    }

    const email = email_addresses[0]?.email_address;
    if (!email) {
      console.error(`User ${id} created without an email.`);
      return new Response("User email not found", { status: 400 });
    }
    
    try {
      if (role === "manager") {
        await prisma.manager.create({
          data: {
            clerkUserId: id,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || "New Manager",
            email: email,
            phoneNumber: "", 
          },
        });
        console.log(`✅ Created Manager in DB: ${id}`);
      } else { // Default to tenant
        await prisma.tenant.create({
          data: {
            clerkUserId: id,
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || "New Tenant",
            email: email,
            phoneNumber: "",
          },
        });
        console.log(`✅ Created Tenant in DB: ${id}`);
      }
    } catch (dbError) {
      console.error("Error creating user in database:", dbError);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("Webhook processed", { status: 200 });
}