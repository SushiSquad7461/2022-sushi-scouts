import type {NextApiRequest, NextApiResponse} from "next";
import {readFileSync, writeFileSync} from "fs";
const filePath = "./data/matchschedule.json";

type Data = {
  result: string
}

type MatchSchedule = {
    "matches": {
        [index: number]: {
            [index: string]: {
                "teamNumber": number,
                "numScouting": number,
                "submitted": boolean
            }
        }
    }
}

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const schedule: MatchSchedule = JSON.parse(readFileSync(filePath).toString());
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

      writeFileSync(filePath, JSON.stringify(schedule));
      res.status(200).json({result: "success"});
    }
  } else {
    res.status(400).json({result: "only quals matches are supported"});
  }
}
