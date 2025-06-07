

// // working script//

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Seeding...');

//   await prisma.payment.deleteMany();
//   await prisma.lease.deleteMany();
//   await prisma.application.deleteMany();
//   await prisma.tenant.deleteMany();
//   await prisma.property.deleteMany();
//   await prisma.manager.deleteMany();
//   await prisma.location.deleteMany();

//   // 1. Create Location
//   const location = await prisma.location.create({
//     data: {
//       address: '123 Main St',
//       city: 'Springfield',
//       state: 'IL',
//       postalCode: '62704',
//       latitude: 39.7817,
//       longitude: -89.6501,
//       country:'USA',
//     },
//   });

//   // 2. Create Manager
//   const manager = await prisma.manager.create({
//     data: {
//       clerkUserId: 'manager_clerk_id_123',
//       name: 'John Manager',
//       email: 'manager@example.com',
//       phoneNumber: '123-456-7890',
//     },
//   });

//   // 3. Create Property
//   const property = await prisma.property.create({
//     data: {
//       name: 'Sunny Downtown Apartment',
//       description: 'A beautiful apartment in the heart of downtown.',
//       pricePerMonth: 1500,
//       securityDeposit: 1500,
//       applicationFee: 50,
//       photoUrls: [
//         'https://example.com/apartment1.jpg',
//         'https://example.com/apartment2.jpg',
//       ],
//       amenities: ['AIR_CONDITIONING', 'PARKING', 'HIGH_SPEED_INTERNET'],
//       highlights: ['CLOSE_TO_TRANSIT', 'LUXURY'],
//       isPetsAllowed: true,
//       isParkingIncluded: true,
//       beds: 2,
//       baths: 1.5,
//       squareFeet: 850,
//       propertyType: 'APARTMENT',
//       postedDate: new Date('2023-05-15'),
//       averageRating: 4.5,
//       numberOfReviews: 12,
//       locationId: location.id,
//       managerClerkId: manager.clerkUserId,
//     },
//   });

//   // 4. Create Tenant
//   const tenant = await prisma.tenant.create({
//     data: {
//       clerkUserId: 'tenant_clerk_id_456',
//       name: 'Jane Tenant',
//       email: 'tenant@example.com',
//       phoneNumber: '987-654-3210',
//       properties: { connect: { id: property.id } }, // example tenant-property relation
//       favorites: { connect: { id: property.id } },  // example favorite
//     },
//   });

//   // 5. Create Application
//   const application = await prisma.application.create({
//     data: {
//       applicationDate: new Date(),
//       status: 'PENDING',
//       propertyId: property.id,
//       tenantClerkId: tenant.clerkUserId,
//       name: tenant.name,
//       email: tenant.email,
//       phoneNumber: tenant.phoneNumber,
//       message: 'Looking forward to hearing from you!',
//     },
//   });

//   // 6. Create Lease
//   const lease = await prisma.lease.create({
//     data: {
//       startDate: new Date('2024-01-01'),
//       endDate: new Date('2024-12-31'),
//       rent: 1500,
//       deposit: 1500,
//       propertyId: property.id,
//       tenantClerkId: tenant.clerkUserId,
//       application: {
//         connect: {
//           id: application.id,
//         },
//       },
//     },
//   });

//   // 7. Create Payment
//   await prisma.payment.create({
//     data: {
//       amount: 1500,
//       status: 'PAID', 
//       amountDue: 1500,
//       amountPaid: 1500,
//       paymentStatus: 'PAID',
//       paymentDate: new Date('2024-01-01'),
//       dueDate: new Date('2024-01-01'),
//       method: 'Credit Card',
//       leaseId: lease.id,
//       createdAt: new Date(),
//     },
//   });

//   console.log('✅ Seeding completed.');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed error:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get a date in the past
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

async function main() {
  console.log('🌱 Starting seed...');
  console.log('🗑️ Clearing previous data...');

  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.application.deleteMany();
  // We need to disconnect many-to-many relations before deleting properties/tenants
  // to avoid constraint violations if we were not cascading deletes properly.
  // This is a safe pre-emptive measure.
  const tenants = await prisma.tenant.findMany();
  for (const tenant of tenants) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { favorites: { set: [] }, properties: { set: [] } },
    });
  }

  await prisma.property.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.location.deleteMany();

  // --- Data Definitions ---

  const locationsData = [
    { address: '123 Main St', city: 'Springfield', state: 'IL', postalCode: '62704', latitude: 39.7817, longitude: -89.6501, country: 'USA' },
    { address: '456 Oak Ave', city: 'Metropolis', state: 'NY', postalCode: '10001', latitude: 40.7128, longitude: -74.0060, country: 'USA' },
    { address: '789 Pine Ln', city: 'Gotham', state: 'NJ', postalCode: '07002', latitude: 40.7357, longitude: -74.1724, country: 'USA' },
    { address: '101 Maple Dr', city: 'Star City', state: 'CA', postalCode: '90210', latitude: 34.0736, longitude: -118.4004, country: 'USA' },
    { address: '212 Birch Rd', city: 'Central City', state: 'MO', postalCode: '63101', latitude: 38.6270, longitude: -90.1994, country: 'USA' },
    { address: '333 Elm Street', city: 'Coast City', state: 'CA', postalCode: '94501', latitude: 37.7749, longitude: -122.4194, country: 'USA' },
    { address: '444 Cedar Blvd', city: 'Keystone City', state: 'PA', postalCode: '19102', latitude: 39.9526, longitude: -75.1652, country: 'USA' },
    { address: '555 Willow Way', city: 'Atlantis', state: 'FL', postalCode: '33462', latitude: 26.6262, longitude: -80.1117, country: 'USA' },
  ];

  const managersData = [
    { clerkUserId: 'manager_clerk_1', name: 'John Manager', email: 'john.manager@example.com', phoneNumber: '111-222-3333' },
    { clerkUserId: 'manager_clerk_2', name: 'Diana Prince', email: 'diana.prince@example.com', phoneNumber: '444-555-6666' },
    { clerkUserId: 'manager_clerk_3', name: 'Nick Fury', email: 'nick.fury@example.com', phoneNumber: '777-888-9999' },
  ];

  const tenantsData = [
    { clerkUserId: 'tenant_clerk_1', name: 'Jane Tenant', email: 'jane.tenant@example.com', phoneNumber: '987-654-3210' },
    { clerkUserId: 'tenant_clerk_2', name: 'Peter Parker', email: 'peter.parker@example.com', phoneNumber: '123-123-1234' },
    { clerkUserId: 'tenant_clerk_3', name: 'Bruce Wayne', email: 'bruce.wayne@example.com', phoneNumber: '555-555-5555' },
    { clerkUserId: 'tenant_clerk_4', name: 'Clark Kent', email: 'clark.kent@example.com', phoneNumber: '777-888-9999' },
    { clerkUserId: 'tenant_clerk_5', name: 'Lois Lane', email: 'lois.lane@example.com', phoneNumber: '888-777-6666' },
    { clerkUserId: 'tenant_clerk_6', name: 'Tony Stark', email: 'tony.stark@example.com', phoneNumber: '212-970-4133' },
    { clerkUserId: 'tenant_clerk_7', name: 'Steve Rogers', email: 'steve.rogers@example.com', phoneNumber: '718-555-0100' },
    { clerkUserId: 'tenant_clerk_8', name: 'Natasha Romanoff', email: 'nat.romanoff@example.com', phoneNumber: '312-555-0199' },
  ];

  const propertiesData = [
    { name: 'Sunny Downtown Apartment', price: 1500, beds: 2, baths: 1.5, sqft: 850, type: 'APARTMENT' as const },
    { name: 'Cozy Suburban House', price: 2200, beds: 3, baths: 2.5, sqft: 1600, type: 'HOUSE' as const },
    { name: 'Modern City Loft', price: 1800, beds: 1, baths: 1, sqft: 700, type: 'APARTMENT' as const },
    { name: 'Quiet Townhouse', price: 1950, beds: 2, baths: 2, sqft: 1200, type: 'TOWNHOUSE' as const },
    { name: 'Studio by the Park', price: 1100, beds: 0, baths: 1, sqft: 450, type: 'STUDIO' as const },
    { name: 'Luxury Penthouse', price: 4500, beds: 3, baths: 3.5, sqft: 2500, type: 'APARTMENT' as const },
    { name: 'Charming Cottage', price: 1600, beds: 2, baths: 1, sqft: 900, type: 'COTTAGE' as const },
    { name: 'Waterfront Villa', price: 3200, beds: 4, baths: 3, sqft: 2200, type: 'HOUSE' as const },
    { name: 'Historic Brownstone', price: 2800, beds: 3, baths: 2.5, sqft: 1800, type: 'TOWNHOUSE' as const },
    { name: 'Eco-friendly Tiny House', price: 950, beds: 1, baths: 1, sqft: 300, type: 'TINYHOUSE' as const },
  ];

  // --- Creation Logic ---

  console.log('🏢 Creating locations...');
  const createdLocations = await Promise.all(locationsData.map(loc => prisma.location.create({ data: loc })));

  console.log('👔 Creating managers...');
  const createdManagers = await Promise.all(managersData.map(man => prisma.manager.create({ data: man })));

  console.log('👤 Creating tenants...');
  const createdTenants = await Promise.all(tenantsData.map(ten => prisma.tenant.create({ data: ten })));

  console.log('🏠 Creating properties...');
  const createdProperties = [];
  for (const propData of propertiesData) {
    const randomLocation = createdLocations[Math.floor(Math.random() * createdLocations.length)];
    const randomManager = createdManagers[Math.floor(Math.random() * createdManagers.length)];
    
    const property = await prisma.property.create({
      data: {
        name: propData.name,
        description: `A lovely ${propData.type.toLowerCase()} in ${randomLocation.city}.`,
        pricePerMonth: propData.price,
        beds: propData.beds,
        baths: propData.baths,
        squareFeet: propData.sqft,
        propertyType: propData.type,
        securityDeposit: propData.price,
        applicationFee: 50,
        photoUrls: ['https://via.placeholder.com/600x400.png?text=Property+Image+1', 'https://via.placeholder.com/600x400.png?text=Property+Image+2'],
        amenities: ['AIR_CONDITIONING', 'PARKING', 'HIGH_SPEED_INTERNET'],
        highlights: ['CLOSE_TO_TRANSIT', 'RECENTLY_RENOVATED'],
        isPetsAllowed: true,
        isParkingIncluded: Math.random() > 0.5,
        postedDate: daysAgo(Math.floor(Math.random() * 90)),
        averageRating: 4.0 + Math.random(),
        numberOfReviews: Math.floor(Math.random() * 50),
        locationId: randomLocation.id,
        managerClerkId: randomManager.clerkUserId,
      }
    });
    createdProperties.push(property);
  }

  console.log('📝 Creating applications, leases, and payments...');

  // --- SCENARIO 1: Active Lease with History ---
  const activeLeaseTenant = createdTenants[0];
  const activeLeaseProperty = createdProperties[0];
  const activeLeaseApp = await prisma.application.create({
    data: { applicationDate: daysAgo(90), status: 'APPROVED', propertyId: activeLeaseProperty.id, tenantClerkId: activeLeaseTenant.clerkUserId, name: activeLeaseTenant.name, email: activeLeaseTenant.email, phoneNumber: activeLeaseTenant.phoneNumber, message: 'I loved the place! Ready to sign.' }
  });
  const activeLease = await prisma.lease.create({
    data: { startDate: daysAgo(60), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), rent: activeLeaseProperty.pricePerMonth, deposit: activeLeaseProperty.securityDeposit, propertyId: activeLeaseProperty.id, tenantClerkId: activeLeaseTenant.clerkUserId, application: { connect: { id: activeLeaseApp.id } } }
  });
  await prisma.payment.create({ data: { amount: activeLease.rent, status: 'PAID', amountDue: activeLease.rent, amountPaid: activeLease.rent, paymentStatus: 'PAID', paymentDate: daysAgo(60), dueDate: daysAgo(60), method: 'Credit Card', leaseId: activeLease.id } });
  await prisma.payment.create({ data: { amount: activeLease.rent, status: 'PAID', amountDue: activeLease.rent, amountPaid: activeLease.rent, paymentStatus: 'PAID', paymentDate: daysAgo(30), dueDate: daysAgo(30), method: 'Credit Card', leaseId: activeLease.id } });
  await prisma.payment.create({ data: { amount: activeLease.rent, status: 'PENDING', amountDue: activeLease.rent, amountPaid: 0, paymentStatus: 'PENDING', paymentDate: new Date(), dueDate: new Date(), method: 'Credit Card', leaseId: activeLease.id } });
  
  // --- SCENARIO 2: Ended Lease ---
  const endedLeaseTenant = createdTenants[2];
  const endedLeaseProperty = createdProperties[4];
  const endedLeaseApp = await prisma.application.create({
    data: { applicationDate: daysAgo(400), status: 'APPROVED', propertyId: endedLeaseProperty.id, tenantClerkId: endedLeaseTenant.clerkUserId, name: endedLeaseTenant.name, email: endedLeaseTenant.email, phoneNumber: endedLeaseTenant.phoneNumber, message: 'This will be a great fit.' }
  });
  const endedLease = await prisma.lease.create({
    data: { startDate: daysAgo(365), endDate: daysAgo(1), rent: endedLeaseProperty.pricePerMonth, deposit: endedLeaseProperty.securityDeposit, propertyId: endedLeaseProperty.id, tenantClerkId: endedLeaseTenant.clerkUserId, application: { connect: { id: endedLeaseApp.id } } }
  });
  await prisma.payment.create({ data: { amount: endedLease.rent, status: 'PAID', amountDue: endedLease.rent, amountPaid: endedLease.rent, paymentStatus: 'PAID', paymentDate: daysAgo(35), dueDate: daysAgo(35), method: 'Bank Transfer', leaseId: endedLease.id } });

  // --- SCENARIO 3: Multiple Pending/Denied Apps ---
  await prisma.application.create({ data: { applicationDate: daysAgo(5), status: 'PENDING', propertyId: createdProperties[1].id, tenantClerkId: createdTenants[1].clerkUserId, name: createdTenants[1].name, email: createdTenants[1].email, phoneNumber: createdTenants[1].phoneNumber, message: 'Interested in a viewing for the suburban house.' } });
  await prisma.application.create({ data: { applicationDate: daysAgo(10), status: 'DENIED', propertyId: createdProperties[1].id, tenantClerkId: createdTenants[3].clerkUserId, name: createdTenants[3].name, email: createdTenants[3].email, phoneNumber: createdTenants[3].phoneNumber, message: 'Application submitted for Oak Ave.' } });
  await prisma.application.create({ data: { applicationDate: daysAgo(2), status: 'PENDING', propertyId: createdProperties[5].id, tenantClerkId: createdTenants[5].clerkUserId, name: createdTenants[5].name, email: createdTenants[5].email, phoneNumber: createdTenants[5].phoneNumber, message: 'Is the penthouse available immediately?' } });
  await prisma.application.create({ data: { applicationDate: daysAgo(15), status: 'DENIED', propertyId: createdProperties[5].id, tenantClerkId: createdTenants[6].clerkUserId, name: createdTenants[6].name, email: createdTenants[6].email, phoneNumber: createdTenants[6].phoneNumber, message: 'Please consider my application.' } });

  console.log('🔗 Connecting favorites...');
  await prisma.tenant.update({ where: { id: createdTenants[0].id }, data: { favorites: { connect: [{ id: createdProperties[1].id }, { id: createdProperties[5].id }] } } });
  await prisma.tenant.update({ where: { id: createdTenants[1].id }, data: { favorites: { connect: [{ id: createdProperties[2].id }, { id: createdProperties[3].id }, { id: createdProperties[4].id }] } } });
  await prisma.tenant.update({ where: { id: createdTenants[5].id }, data: { favorites: { connect: [{ id: createdProperties[5].id }] } } });
  await prisma.tenant.update({ where: { id: createdTenants[7].id }, data: { favorites: { connect: [{ id: createdProperties[0].id }, { id: createdProperties[8].id }] } } });

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

