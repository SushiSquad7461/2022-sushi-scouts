import type {NextApiRequest, NextApiResponse} from "next";
import {readFileSync} from "fs";
import {MatchSchedule} from "../../data/scouting-config";
const filePath = "./data/matchschedule.json";

export type currScoutingType = {
        stationId: string,
        scouting: boolean
}

type Data = {
  currScouting: Array<currScoutingType>,
  stats: [
      {
        [index: string]: string
      }
  ]
}

type ErrorData = {
    "err": string
}

/**
 * Get the current scouting stats
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorData>,
) {
  const schedule: MatchSchedule = JSON.parse(readFileSync(filePath).toString());
  let currQual: number = parseInt(req.query["currQual"].toString());
  let maxQual: number = parseInt(req.query["maxQual"].toString());
  const lastMatch: number = schedule["matches"].length;

  console.log(req.query["currQual"]);

  if (isNaN(currQual) || isNaN(maxQual)) {
    console.log("help....");
    res.status(400).json({"err": "invalid numbers"});
  } else {
    if (currQual > lastMatch) {
      currQual = lastMatch;
    }

    if (maxQual > lastMatch) {
      maxQual = lastMatch;
    }

    const currScouting = [];

    for (const i of Object.keys(schedule["matches"][currQual-1])) {
      currScouting.push({stationId: i, scouting:
            (schedule["matches"][currQual-1][i].numScouting > 0)});
    }

    console.log(currScouting);

    res.status(200).json({"currScouting": currScouting, "stats": [{"2": "3"}]});
  }
}
