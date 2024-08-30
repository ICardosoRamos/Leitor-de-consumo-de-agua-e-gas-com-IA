/*
  Warnings:

  - A unique constraint covering the columns `[measure_date]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Measure_measure_date_key" ON "Measure"("measure_date");
