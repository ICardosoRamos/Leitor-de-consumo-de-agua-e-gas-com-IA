/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `measure_value` to the `Measure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "measure_value" INTEGER NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Measure_uuid_key" ON "Measure"("uuid");
