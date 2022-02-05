// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { match } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next'
// TODO: FIX IMPORTS
const users = require("../../data/matchdata.json");
const fs = require("fs");

type Data = {
  result: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const matchData = req.body;
  users.matchData.push(matchData);

  // TODO: CLEANUP
  fs.writeFile("./data/matchdata.json", JSON.stringify(users), (err: Error) => {

    // Checking for errors
    if (err) res.status(500).json({ result : err.message }); 
    
    res.status(200).json({ result : "success" })
});
}
