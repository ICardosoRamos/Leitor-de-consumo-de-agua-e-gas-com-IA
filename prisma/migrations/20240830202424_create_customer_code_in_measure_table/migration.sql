/*
  Warnings:

  - You are about to drop the column `userId` on the `Measure` table. All the data in the column will be lost.
  - Added the required column `customer_code` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_userId_fkey";

-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "userId",
ADD COLUMN     "customer_code" TEXT NOT NULL;
