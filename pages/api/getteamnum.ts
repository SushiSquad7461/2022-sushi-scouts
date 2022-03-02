import type {NextApiRequest, NextApiResponse} from "next";
import {v1 as uuidv1} from "uuid";
import {writeFile} from "fs";

type MatchSchedule = {
  [index: string] : CompetitorInfo[][]
}

type CurrentScouting = {
  [index: string] : {
    "num": number,
    "type": string,
    "index": number
  }
}

type CompetitorInfo = {
  "teamNum": string,
  "numScouting": number,
  "scouted": boolean
}

// Get match schedule
const schedule: MatchSchedule = require("../../data/matchschedule.json");

const currentScouting: CurrentScouting = {};

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
  let clientId = req.query["id"].toString();
  const matchTypeLower = matchType.toString().toLowerCase();
  const matchNum = parseInt(matchNumString.toString());

  if (clientId === "null") {
    clientId = uuidv1();
  }

  // List of robots in current match match
  let competitors: CompetitorInfo[] = [];

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

  let minIndex = 0;
  let min = Number.POSITIVE_INFINITY;

  for (let i=0; i < competitors.length; ++i) {
    if (competitors[i].numScouting < min) {
      min = competitors[i].numScouting;
      minIndex = i;
    }
  }

  const matchId = {
    "num": matchNum,
    "type": matchType.toString(),
    "index": minIndex,
  };

  competitors[minIndex].numScouting += 1;

  if (currentScouting[clientId] !== undefined) {
    const prevMatchId = currentScouting[clientId];
    schedule[prevMatchId.type.toLowerCase()][(prevMatchId.num)-1][
        prevMatchId.index].numScouting -= 1;
  }

  currentScouting[clientId] = matchId;

  writeFile("./data/matchschedule.json",
      JSON.stringify(schedule),
      (err: Error | null) => {
        // If error return 500 message
        if (err) res.status(500).json({result: err.message});
      });

  // Send the team number
  res.status(200).json({
    id: clientId,
    num: competitors[minIndex].teamNum,
  });
}
