/*
  Warnings:

  - You are about to drop the column `measure_date` on the `Measure` table. All the data in the column will be lost.
  - Added the required column `measure_month` to the `Measure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measure_year` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Measure_measure_date_key";

-- AlterTable
ALTER TABLE "Measure" DROP COLUMN "measure_date",
ADD COLUMN     "measure_month" TEXT NOT NULL,
ADD COLUMN     "measure_year" TEXT NOT NULL;
