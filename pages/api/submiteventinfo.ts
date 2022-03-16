import type {NextApiRequest, NextApiResponse} from "next";
import users from "../../data/matchdata.json";
import {readFileSync, writeFile, writeFileSync} from "fs";
import {MatchSchedule} from "../../data/scouting-config";

const filePath = "./data/matchschedule.json";

type Data = {
  result: string
}

/**
 * Adds scouting info to database
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  // Add match data to json database
  const matchData = req.body;
  users.matchData.push(matchData);

  const matchType = matchData["match info:match type"];
  const matchNum = parseInt(matchData["match info:match #"]);
  const stationId = matchData["match info:station id"];

  const schedule: MatchSchedule = JSON.parse(readFileSync(filePath).toString());

  if (matchType.toLowerCase() == "quals match" && schedule["matches"][
      matchNum-1][stationId]["submitted"] === false) {
    schedule["matches"][matchNum-1][stationId]["submitted"] = true;
    writeFileSync(filePath, JSON.stringify(schedule));
  }

  writeFile("./data/matchdata.json",
      JSON.stringify(users),
      (err: Error | null) => {
        // If error return 500 message
        if (err) res.status(500).json({result: err.message});
      });

  // Successfully added data
  res.status(200).json({result: "success"});
}
