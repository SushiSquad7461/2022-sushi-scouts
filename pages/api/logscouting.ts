import type {NextApiRequest, NextApiResponse} from "next";
import {readFileSync, writeFileSync} from "fs";
import {MatchSchedule} from "../../data/scouting-config";

type Data = {
  result: string
}

/**
 * Log that a computer is scouting a team
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const schedule: MatchSchedule = JSON.parse(readFileSync(
    process.env.MATCH_SCHEDULE_PATH!).toString());
  // Get the current match number, the the type of match (Finals, etc...)
  const matchNumString = req.query["matchNum"];
  const matchType = req.query["matchType"];
  const station = req.query["station"];

  if (matchType.toString().toLowerCase() == "quals match") {
    if (schedule["matches"][
        parseInt(matchNumString.toString())-1][station.
        toString()]["numScouting"] > 0) {
      res.status(400).json({result: "match is already scouted"});
    } else {
      schedule["matches"][
          parseInt(matchNumString.toString())-1][station.
          toString()]["numScouting"] = 1;

      console.log(schedule);

      writeFileSync(
        process.env.MATCH_SCHEDULE_PATH!, JSON.stringify(schedule));
      res.status(200).json({result: "success"});
    }
  } else {
    res.status(400).json({result: "only quals matches are supported"});
  }
}
