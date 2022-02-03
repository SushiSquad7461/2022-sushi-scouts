// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: FIX IMPORTS
const schedule = require("../../data/matchschedule.json");
// TODO: NEW NAME
let currentNum = 0;
let scouted = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { matchNum, matchType } = req.query;
  let competitors = [];

  if (parseInt(matchNum.toString()) > schedule[matchType.toString().toLowerCase()].length) {
    competitors = schedule[matchType.toString().toLowerCase()][schedule[matchType.toString().toLowerCase()].length-1];
  } else if (parseInt(matchNum.toString()) <= 0){
    console.log("IN")
    competitors = schedule[matchType.toString().toLowerCase()][0];
  } else {
    competitors = schedule[matchType.toString().toLowerCase()][parseInt(matchNum.toString())-1];
  }

  if (scouted[matchNum + matchType] === undefined || scouted[matchNum + matchType] >= 6) {
    scouted[matchNum + matchType] = 1;
  } else {
    scouted[matchNum + matchType] += 1;
  }
  res.status(200).send(competitors[scouted[matchNum + matchType] - 1]);
}
