import type {NextApiRequest, NextApiResponse} from "next";

type MatchSchedule = {
  [index: string] : string[][]
}

type ScoutedRobot = {
  [index: string] : number
}

// Get match schedule
const schedule: MatchSchedule = require("../../data/matchschedule.json");

// List of the index that needs to be scouted
const scouted: ScoutedRobot = {};

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  // Get the current match number, the the type of match (Finals, etc...)
  const matchNumString = req.query["matchNum"];
  const matchType = req.query["matchType"];
  const matchTypeLower = matchType.toString().toLowerCase();
  const matchNum = parseInt(matchNumString.toString());

  // List of robots in current match match
  let competitors: string[] = [];

  if (matchNum > schedule[matchTypeLower].length) {
    // Match number is not in schedule, get last match in schedule
    competitors = schedule[matchTypeLower][schedule[matchTypeLower].length-1];
  } else if (matchNum <= 0) {
    // Match number is not in schedule, get first match in schedule
    competitors = schedule[matchTypeLower][0];
  } else {
    // Get current robots in match
    competitors = schedule[matchTypeLower][matchNum-1];
  }

  const matchId = matchNumString + matchType.toString();
  if (scouted[matchId] === undefined || scouted[matchId] >= 6) {
    scouted[matchId] = 1;
  } else {
    scouted[matchId] += 1;
  }

  // Send the team number
  res.status(200).send(competitors[scouted[matchId] - 1]);
}
