// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";

// const prisma = new PrismaClient();

// function parseCoordinates(point: string): { latitude: number; longitude: number } {
//   const match = point.match(/POINT\((-?\d+\.\d+)\s+(-?\d+\.\d+)\)/);
//   if (!match) throw new Error(`Invalid coordinates format: ${point}`);
//   return {
//     longitude: parseFloat(match[1]),
//     latitude: parseFloat(match[2]),
//   };
// }

// async function deleteAllData() {
//   await prisma.payment.deleteMany();
//   await prisma.lease.deleteMany();
//   await prisma.application.deleteMany();
//   await prisma.property.deleteMany();
//   await prisma.tenant.deleteMany();
//   await prisma.manager.deleteMany();
//   await prisma.location.deleteMany();
// }

// async function main() {
//   const seedPath = path.join(__dirname, "seedData");

//   // Clear existing data
//   await deleteAllData();

//   // Read JSON files
//   const rawLocations = JSON.parse(fs.readFileSync(path.join(seedPath, "location.json"), "utf-8"));
//   const managers: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "manager.json"), "utf-8"));
//   const tenants: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "tenant.json"), "utf-8"));
//   const properties: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "property.json"), "utf-8"));
//   const applications: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "application.json"), "utf-8"));
//   const leases: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "lease.json"), "utf-8"));
//   const payments: any[] = JSON.parse(fs.readFileSync(path.join(seedPath, "payment.json"), "utf-8"));

//   // Parse locations coordinates
//   const locations = rawLocations.map((loc: any) => {
//     const { latitude, longitude } = parseCoordinates(loc.coordinates);
//     return {
//       id: loc.id,
//       address: loc.address,
//       city: loc.city,
//       state: loc.state,
//       postalCode: loc.postalCode,
//       latitude,
//       longitude,
//     };
//   });

//   // Insert locations
//   await prisma.location.createMany({ data: locations, skipDuplicates: true });

//   // Map managers properly for Prisma model
//   const managersWithClerkId = managers.map((m) => ({
//     clerkUserId: m.clerkUserId || m.externalId,
//     name: `${m.firstName} ${m.lastName}`,
//     email: m.emailAddresses?.[0]?.emailAddress ?? '',
//     phoneNumber: m.phoneNumbers?.[0]?.phoneNumber ?? '',
//   }));

//   // Insert managers
//   await prisma.manager.createMany({ data: managersWithClerkId, skipDuplicates: true });

//   // Map tenants properly if needed, example mapping:
//   const tenantsMapped = tenants.map((t) => {
//     if (!t.clerkUserId && !t.externalId) {
//       throw new Error(`Missing clerkUserId or externalId in tenant: ${JSON.stringify(t)}`);
//     }
//     const firstName = t.firstName ?? "";
//     const lastName = t.lastName ?? "";
//     return {
//       clerkUserId: t.clerkUserId || t.externalId,
//       name: `${firstName} ${lastName}`.trim() || "Unknown Name",
//       email: t.emailAddresses?.[0]?.emailAddress ?? '',
//       phoneNumber: t.phoneNumbers?.[0]?.phoneNumber ?? '',
//     };
//   });
  

//   // Insert tenants
//   await prisma.tenant.createMany({ data: tenantsMapped, skipDuplicates: true });

//   // Insert properties individually (for potential relations or nested fields)
//   for (const property of properties) {
//     await prisma.property.create({ data: property });
//   }

//   // Insert applications individually
//   for (const application of applications) {
//     await prisma.application.create({ data: application });
//   }

//   // Insert leases individually
//   for (const lease of leases) {
//     await prisma.lease.create({ data: lease });
//   }

//   // Insert payments with createMany
//   await prisma.payment.createMany({ data: payments, skipDuplicates: true });

//   console.log("✅ Seed complete");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed error:", e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.application.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.property.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.location.deleteMany();

  // 1. Create Location
  const location = await prisma.location.create({
    data: {
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      latitude: 39.7817,
      longitude: -89.6501,
      country:'USA',
    },
  });

  // 2. Create Manager
  const manager = await prisma.manager.create({
    data: {
      clerkUserId: 'manager_clerk_id_123',
      name: 'John Manager',
      email: 'manager@example.com',
      phoneNumber: '123-456-7890',
    },
  });

  // 3. Create Property
  const property = await prisma.property.create({
    data: {
      name: 'Sunny Downtown Apartment',
      description: 'A beautiful apartment in the heart of downtown.',
      pricePerMonth: 1500,
      securityDeposit: 1500,
      applicationFee: 50,
      photoUrls: [
        'https://example.com/apartment1.jpg',
        'https://example.com/apartment2.jpg',
      ],
      amenities: ['AIR_CONDITIONING', 'PARKING', 'HIGH_SPEED_INTERNET'],
      highlights: ['CLOSE_TO_TRANSIT', 'LUXURY'],
      isPetsAllowed: true,
      isParkingIncluded: true,
      beds: 2,
      baths: 1.5,
      squareFeet: 850,
      propertyType: 'APARTMENT',
      postedDate: new Date('2023-05-15'),
      averageRating: 4.5,
      numberOfReviews: 12,
      locationId: location.id,
      managerClerkId: manager.clerkUserId,
    },
  });

  // 4. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      clerkUserId: 'tenant_clerk_id_456',
      name: 'Jane Tenant',
      email: 'tenant@example.com',
      phoneNumber: '987-654-3210',
      properties: { connect: { id: property.id } }, // example tenant-property relation
      favorites: { connect: { id: property.id } },  // example favorite
    },
  });

  // 5. Create Application
  const application = await prisma.application.create({
    data: {
      applicationDate: new Date(),
      status: 'PENDING',
      propertyId: property.id,
      tenantClerkId: tenant.clerkUserId,
      name: tenant.name,
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      message: 'Looking forward to hearing from you!',
    },
  });

  // 6. Create Lease
  const lease = await prisma.lease.create({
    data: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      rent: 1500,
      deposit: 1500,
      propertyId: property.id,
      tenantClerkId: tenant.clerkUserId,
      application: {
        connect: {
          id: application.id,
        },
      },
    },
  });

  // 7. Create Payment
  await prisma.payment.create({
    data: {
      amountDue: 1500,
      amountPaid: 1500,
      paymentStatus: 'PAID', // if enum
      paymentDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-01'),
      method: 'Credit Card',
      leaseId: lease.id,
      createdAt: new Date(),
    },
  });

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

