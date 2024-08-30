/*
  Warnings:

  - Changed the type of `measure_month` on the `Measure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "measure_month",
ADD COLUMN     "measure_month" INTEGER NOT NULL;
