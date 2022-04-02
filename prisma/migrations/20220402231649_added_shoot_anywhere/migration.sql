/*
  Warnings:

  - You are about to drop the column `teleop_groundPickup` on the `Matchdata` table. All the data in the column will be lost.
  - You are about to drop the column `teleop_terminalPickup` on the `Matchdata` table. All the data in the column will be lost.
  - Added the required column `shootAnywhere` to the `Matchdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swerveDrive` to the `Matchdata` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Matchdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "teamNumber" TEXT NOT NULL,
    "comp" TEXT NOT NULL,
    "matchNum" INTEGER NOT NULL,
    "matchType" TEXT NOT NULL,
    "teamScouted" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "auto_show" TEXT NOT NULL,
    "auto_move" TEXT NOT NULL,
    "auto_lowHub" INTEGER NOT NULL,
    "auto_humanPlayer" INTEGER NOT NULL,
    "auto_upperHub" INTEGER NOT NULL,
    "shootAnywhere" TEXT NOT NULL,
    "swerveDrive" TEXT NOT NULL,
    "teleop_lowHub" INTEGER NOT NULL,
    "teleop_highHub" INTEGER NOT NULL,
    "end_climb" TEXT NOT NULL,
    "end_climbLevel" TEXT NOT NULL,
    "end_defense" TEXT NOT NULL,
    "end_notes" TEXT NOT NULL
);
INSERT INTO "new_Matchdata" ("auto_humanPlayer", "auto_lowHub", "auto_move", "auto_show", "auto_upperHub", "comp", "end_climb", "end_climbLevel", "end_defense", "end_notes", "id", "matchNum", "matchType", "name", "stationId", "teamNumber", "teamScouted", "teleop_highHub", "teleop_lowHub") SELECT "auto_humanPlayer", "auto_lowHub", "auto_move", "auto_show", "auto_upperHub", "comp", "end_climb", "end_climbLevel", "end_defense", "end_notes", "id", "matchNum", "matchType", "name", "stationId", "teamNumber", "teamScouted", "teleop_highHub", "teleop_lowHub" FROM "Matchdata";
DROP TABLE "Matchdata";
ALTER TABLE "new_Matchdata" RENAME TO "Matchdata";
CREATE UNIQUE INDEX "Matchdata_teamScouted_stationId_matchNum_comp_key" ON "Matchdata"("teamScouted", "stationId", "matchNum", "comp");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
