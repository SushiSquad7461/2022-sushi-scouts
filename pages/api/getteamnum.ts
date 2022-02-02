// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: FIX IMPORTS
const schedule = require("../../data/matchschedule.json");
// TODO: NEW NAME
let currentNum = 0;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { matchNum, type } = req.query;
  let competitors = [];

  if (parseInt(matchNum.toString()) > schedule[type.toString().toLowerCase()].length) {
    competitors = schedule[type.toString().toLowerCase()][schedule[type.toString().toLowerCase()].length-1];
  } else if (parseInt(matchNum.toString()) <= 0){
    competitors = schedule[type.toString().toLowerCase()][0];
  } else {
    competitors = schedule[type.toString().toLowerCase()][parseInt(matchNum.toString())-1];
  }

  currentNum += 1;

  if (currentNum > 6) {

  }

  res.status(200).send(competitors[currentNum - 1]);
}
