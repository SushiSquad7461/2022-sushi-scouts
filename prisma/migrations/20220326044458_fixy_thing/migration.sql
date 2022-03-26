-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Matchdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "teleop_groundPickup" TEXT NOT NULL,
    "teleop_terminalPickup" TEXT NOT NULL,
    "teleop_lowHub" INTEGER NOT NULL,
    "teleop_highHub" INTEGER NOT NULL,
    "end_climb" TEXT NOT NULL,
    "end_climbLevel" TEXT NOT NULL,
    "end_defense" TEXT NOT NULL,
    "end_notes" TEXT NOT NULL
);
INSERT INTO "new_Matchdata" ("auto_humanPlayer", "auto_lowHub", "auto_move", "auto_show", "auto_upperHub", "comp", "end_climb", "end_climbLevel", "end_defense", "end_notes", "id", "matchNum", "matchType", "stationId", "teamNumber", "teamScouted", "teleop_groundPickup", "teleop_highHub", "teleop_lowHub", "teleop_terminalPickup") SELECT "auto_humanPlayer", "auto_lowHub", "auto_move", "auto_show", "auto_upperHub", "comp", "end_climb", "end_climbLevel", "end_defense", "end_notes", "id", "matchNum", "matchType", "stationId", "teamNumber", "teamScouted", "teleop_groundPickup", "teleop_highHub", "teleop_lowHub", "teleop_terminalPickup" FROM "Matchdata";
DROP TABLE "Matchdata";
ALTER TABLE "new_Matchdata" RENAME TO "Matchdata";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
