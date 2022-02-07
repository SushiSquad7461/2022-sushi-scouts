// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: FIX IMPORTS

type MatchSchedule = {
  [index: string] : string[][]
}

type ScoutedRobot = {
  [index: string] : number
}

const schedule: MatchSchedule = require("../../data/matchschedule.json");

// TODO: NEW NAME
let currentNum = 0;
let scouted: ScoutedRobot = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { matchNum, matchType } = req.query;
  let competitors: string[] = [];
  const matchTypeLower = matchType.toString().toLowerCase();

  if (parseInt(matchNum.toString()) > schedule[matchType.toString().toLowerCase()].length) {
    competitors = schedule[matchTypeLower][schedule[matchTypeLower].length-1];
  } else if (parseInt(matchNum.toString()) <= 0){
    competitors = schedule[matchTypeLower][0];
  } else {
    competitors = schedule[matchTypeLower][parseInt(matchNum.toString())-1];
  }

  if (scouted[matchNum + matchType.toString()] === undefined || scouted[matchNum + matchType.toString()] >= 6) {
    scouted[matchNum + matchType.toString()] = 1;
  } else {
    scouted[matchNum + matchType.toString()] += 1;
  }
  res.status(200).send(competitors[scouted[matchNum + matchType.toString()] - 1]);
}
