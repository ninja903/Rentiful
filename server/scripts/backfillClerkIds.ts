import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dummy function: Replace with real mapping logic
async function getClerkIdFromCognito(cognitoId: string): Promise<string | null> {
  // For demonstration, we just return the same ID.
  // Replace this with an actual call to Clerk or a lookup in a mapping table.
  return cognitoId;
}

async function backfillClerkIds() {
  // Backfill Tenant.clerkUserId
  const tenants = await prisma.tenant.findMany();
  for (const tenant of tenants) {
    if (tenant.cognitoId && !tenant.clerkUserId) {
      const clerkUserId = await getClerkIdFromCognito(tenant.cognitoId);
      if (clerkUserId) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: { clerkUserId },
        });
        console.log(`✅ Tenant ${tenant.id}: clerkUserId updated`);
      }
    }
  }

  // Backfill Manager.clerkUserId
  const managers = await prisma.manager.findMany();
  for (const manager of managers) {
    if (manager.cognitoId && !manager.clerkUserId) {
      const clerkUserId = await getClerkIdFromCognito(manager.cognitoId);
      if (clerkUserId) {
        await prisma.manager.update({
          where: { id: manager.id },
          data: { clerkUserId },
        });
        console.log(`✅ Manager ${manager.id}: clerkUserId updated`);
      }
    }
  }

  // Backfill Property.managerClerkId
  const properties = await prisma.property.findMany();
  for (const property of properties) {
    if (property.managerCognitoId && !property.managerClerkId) {
      const managerClerkId = await getClerkIdFromCognito(property.managerCognitoId);
      if (managerClerkId) {
        await prisma.property.update({
          where: { id: property.id },
          data: { managerClerkId },
        });
        console.log(`✅ Property ${property.id}: managerClerkId updated`);
      }
    }
  }

  // Backfill Application.tenantClerkId
  const applications = await prisma.application.findMany();
  for (const application of applications) {
    if (application.tenantCognitoId && !application.tenantClerkId) {
      const tenantClerkId = await getClerkIdFromCognito(application.tenantCognitoId);
      if (tenantClerkId) {
        await prisma.application.update({
          where: { id: application.id },
          data: { tenantClerkId },
        });
        console.log(`✅ Application ${application.id}: tenantClerkId updated`);
      }
    }
  }

  // Backfill Lease.tenantClerkId
  const leases = await prisma.lease.findMany();
  for (const lease of leases) {
    if (lease.tenantCognitoId && !lease.tenantClerkId) {
      const tenantClerkId = await getClerkIdFromCognito(lease.tenantCognitoId);
      if (tenantClerkId) {
        await prisma.lease.update({
          where: { id: lease.id },
          data: { tenantClerkId },
        });
        console.log(`✅ Lease ${lease.id}: tenantClerkId updated`);
      }
    }
  }
}

backfillClerkIds()
  .then(() => {
    console.log('🎉 Backfill complete');
  })
  .catch((e) => {
    console.error('❌ Error during backfill:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
