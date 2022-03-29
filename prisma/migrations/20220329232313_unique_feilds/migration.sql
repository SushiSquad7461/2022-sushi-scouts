/*
  Warnings:

  - A unique constraint covering the columns `[teamScouted,stationId,matchNum,comp]` on the table `Matchdata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Matchdata_teamScouted_stationId_matchNum_comp_key" ON "Matchdata"("teamScouted", "stationId", "matchNum", "comp");
