// client/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const role = user.publicMetadata?.role as string;
  if (role === "manager") return redirect("/manager");
  if (role === "tenant") return redirect("/tenants");

  // Fallback if role is missing
  return redirect("/select-role");
}