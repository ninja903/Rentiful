/*
  Warnings:

  - You are about to alter the column `amountDue` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amountPaid` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amountDue" SET DATA TYPE INTEGER,
ALTER COLUMN "amountPaid" SET DATA TYPE INTEGER;
