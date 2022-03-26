-- CreateTable
CREATE TABLE "Matchdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamNumber" INTEGER NOT NULL,
    "comp" TEXT NOT NULL,
    "matchNum" INTEGER NOT NULL,
    "matchType" TEXT NOT NULL,
    "teamScouted" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "auto_show" BOOLEAN NOT NULL,
    "auto_move" BOOLEAN NOT NULL,
    "auto_lowHub" INTEGER NOT NULL,
    "auto_humanPlayer" INTEGER NOT NULL,
    "auto_upperHub" INTEGER NOT NULL,
    "teleop_groundPickup" BOOLEAN NOT NULL,
    "teleop_terminalPickup" BOOLEAN NOT NULL,
    "teleop_lowHub" INTEGER NOT NULL,
    "teleop_highHub" INTEGER NOT NULL,
    "end_climb" TEXT NOT NULL,
    "end_climbLevel" TEXT NOT NULL,
    "end_climbPoints" INTEGER NOT NULL,
    "end_defense" BOOLEAN NOT NULL,
    "end_notes" TEXT NOT NULL
);
