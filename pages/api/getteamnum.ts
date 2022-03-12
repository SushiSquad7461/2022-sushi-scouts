import type {NextApiRequest, NextApiResponse} from "next";
import {v1 as uuidv1} from "uuid";
import {stat, writeFile, readFileSync} from "fs";

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
  let teamNum = "0000";
  // Get the current match number, the the type of match (Finals, etc...)
  const matchNumString = req.query["matchNum"];
  const matchType = req.query["matchType"];
  const station = req.query["station"]
  if( matchType != 'QUALS MATCH') {
    teamNum = "0000"
  }
  else {
    try {
      const schedule = require('../../data/matchschedule.json');
      teamNum = schedule['matches'][parseInt(matchNumString)-1][station]["teamNumber"];
    } catch(err) {
      console.log(`Error reading file from disk: ${err}`);
    }
  }
  // Send the team number
  res.status(200).json({
    num: teamNum
  });
}
