/*
  Warnings:

  - The values [LAUNDRY,PET_FRIENDLY,FURNISHED,WHEELCHAIR_ACCESS] on the enum `Amenity` will be removed. If these variants are still used in the database, this will fail.
  - The values [REJECTED,WITHDRAWN,PROCESSING] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW_CONSTRUCTION,WATERFRONT,HISTORIC,LUXURY,RENOVATED,SMART_HOME,GREEN_BUILDING] on the enum `Highlight` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONDO,LAND,DUPLEX] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `baths` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `tenantClerkId` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `country` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDue` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDate` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Amenity_new" AS ENUM ('AIR_CONDITIONING', 'WASHER_DRYER', 'PARKING', 'POOL', 'GYM', 'DISHWASHER', 'HIGH_SPEED_INTERNET');
ALTER TABLE "Property" ALTER COLUMN "amenities" TYPE "Amenity_new"[] USING ("amenities"::text::"Amenity_new"[]);
ALTER TYPE "Amenity" RENAME TO "Amenity_old";
ALTER TYPE "Amenity_new" RENAME TO "Amenity";
DROP TYPE "Amenity_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('PENDING', 'APPROVED', 'DENIED');
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Highlight_new" AS ENUM ('HIGH_SPEED_INTERNET', 'CLOSE_TO_TRANSIT', 'GREAT_VIEW', 'RECENTLY_RENOVATED', 'QUIET_NEIGHBORHOOD', 'SMOKE_FREE');
ALTER TABLE "Property" ALTER COLUMN "highlights" TYPE "Highlight_new"[] USING ("highlights"::text::"Highlight_new"[]);
ALTER TYPE "Highlight" RENAME TO "Highlight_old";
ALTER TYPE "Highlight_new" RENAME TO "Highlight";
DROP TYPE "Highlight_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('APARTMENT', 'HOUSE', 'TOWNHOUSE', 'STUDIO', 'COTTAGE', 'TINYHOUSE');
ALTER TABLE "Property" ALTER COLUMN "propertyType" TYPE "PropertyType_new" USING ("propertyType"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "PropertyType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_tenantClerkId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "tenantClerkId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "method",
DROP COLUMN "status",
ADD COLUMN     "amountDue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "amountPaid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "isPetsAllowed" DROP DEFAULT,
ALTER COLUMN "isParkingIncluded" DROP DEFAULT,
ALTER COLUMN "baths" SET DATA TYPE INTEGER,
ALTER COLUMN "postedDate" DROP DEFAULT,
ALTER COLUMN "averageRating" DROP DEFAULT,
ALTER COLUMN "numberOfReviews" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_tenantClerkId_fkey" FOREIGN KEY ("tenantClerkId") REFERENCES "Tenant"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
