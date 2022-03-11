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

  // Send the team number
  res.status(200).json({
    id: clientId,
    num: competitors[minIndex].teamNum,
  });
}
