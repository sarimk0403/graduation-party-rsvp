/*
  Warnings:

  - You are about to drop the column `plusOne` on the `Guest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "plusOne",
ADD COLUMN     "additionalGuests" INTEGER NOT NULL DEFAULT 0;
