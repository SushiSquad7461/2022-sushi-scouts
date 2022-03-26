import type {NextApiRequest, NextApiResponse} from "next";
// import users from "../../data/matchdata.json";
import {readFileSync, writeFile, writeFileSync} from "fs";
import {MatchSchedule} from "../../data/scouting-config";
import {PrismaClient} from '@prisma/client'
import { match } from "assert";

const filePath = "./data/matchschedule.json";
const prisma = new PrismaClient();

type Data = {
  result: string
}

/**
 * Adds scouting info to database
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  // Add match data to json database
  const matchData = req.body;
  // users.matchData.push(matchData);

  const matchType = matchData["match info:match type"];
  const matchNum = parseInt(matchData["match info:match #"]);
  const stationId = matchData["match info:station id"];
  const schedule: MatchSchedule = JSON.parse(readFileSync(filePath).toString());

  if (matchType.toLowerCase() == "quals match" && schedule["matches"][
      matchNum-1][stationId]["submitted"] === false) {
    schedule["matches"][matchNum-1][stationId]["submitted"] = true;
    writeFileSync(filePath, JSON.stringify(schedule));
  }

  await prisma.matchdata.create({
    data: {
      'teamNumber' : matchData["teamNumber"],
      'comp' : matchData['comp'],
      'matchNum' : parseInt(matchData['match info:match #']),
      'matchType' : matchData['match info:match type'],
      'teamScouted' : matchData["match info:team # you're scouting"],
      'stationId' : matchData["match info:station id"],
      'auto_show' : matchData["auto:no show"] !== "off",
      'auto_move' : matchData["auto:move off tarmac"] !== "off",
      "auto_lowHub" : matchData["auto:scored lower hub"],
      "auto_humanPlayer" : matchData["auto:scored by hp"],
      "auto_upperHub" : matchData["auto:scored upper hub"],
      "teleop_groundPickup" : matchData["teleop:ground pickup"] !== "off",
      "teleop_terminalPickup" : matchData["teleop:terminal pickup"] !== "off",
      "teleop_lowHub" : matchData["teleop:scored lower hub"],
      "teleop_highHub" : matchData["teleop:scored upper hub"],
      "end_climb" : matchData["end game:climb"],
      "end_climbLevel" : matchData["end game:climb type"],
      "end_defense" : matchData["end game:defense"] !== "off",
      "end_notes" : matchData["end game:notes"],
    }
  });

  // writeFile("./data/matchdata.json",
  //     JSON.stringify(users),
  //     (err: Error | null) => {
  //       // If error return 500 message
  //       if (err) res.status(500).json({result: err.message});
  //     });

  // Successfully added data
  res.status(200).json({result: "success"});
}
