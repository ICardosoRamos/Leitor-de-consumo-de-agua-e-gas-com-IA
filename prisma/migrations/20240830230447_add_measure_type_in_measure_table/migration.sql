/*
  Warnings:

  - Added the required column `measure_type` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "measure_type" TEXT NOT NULL;
