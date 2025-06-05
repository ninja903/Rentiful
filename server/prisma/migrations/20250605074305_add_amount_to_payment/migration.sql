/*
  Warnings:

  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Highlight" ADD VALUE 'LUXURY';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amount" INTEGER NOT NULL;
