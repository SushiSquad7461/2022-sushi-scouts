-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchNum" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "teamNum" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "numScouting" INTEGER NOT NULL,
    "event" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_matchNum_stationId_event_key" ON "Schedule"("matchNum", "stationId", "event");
