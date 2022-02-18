import type { NextApiRequest, NextApiResponse } from 'next'
import * as users from "../../data/matchdata.json";
import { writeFile } from "fs";

type Data = {
  result: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Add match data to json database
  const matchData = req.body;
  users.matchData.push(matchData);

  writeFile("./data/matchdata.json", JSON.stringify(users), (err: Error | null) => {
    // If error return 500 message
    if (err) res.status(500).json({ result : err.message });
  });

  // Successfully added data
  res.status(200).json({ result : "success" })
}
