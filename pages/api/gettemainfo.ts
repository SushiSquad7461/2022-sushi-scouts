// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { match } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: FIX IMPORTS
const teamInfo = require("../../data/teamconfig.json");
const comps = require("../../data/comps.json");

type Data = {
  result: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log(teamInfo);
    console.log(comps);
  res.status(200).json({ result : "success" })
}
