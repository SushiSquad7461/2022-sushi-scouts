import type {NextApiRequest, NextApiResponse} from "next";
import {readFileSync} from "fs";
import {MatchSchedule} from "../../data/scouting-config";
const filePath = "./data/matchschedule.json";

export type currScoutingType = {
        stationId: string,
        scouting: boolean
}

export type statsType = {
  [index: string]: string
}

type Data = {
  currScouting: Array<currScoutingType>,
  stats: Array<statsType>
}

/**
 * Get the current scouting stats
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const schedule: MatchSchedule = JSON.parse(readFileSync(filePath).toString());
  let currQual: number = parseInt(req.query["currQual"].toString());
  let maxQual: number = parseInt(req.query["maxQual"].toString());
  const lastMatch: number = schedule["matches"].length;

  if (isNaN(currQual) || isNaN(maxQual)) {
    res.status(400).json({"currScouting": [], "stats": []});
  } else {
    if (currQual > lastMatch) {
      currQual = lastMatch;
    }

    if (maxQual > lastMatch) {
      maxQual = lastMatch;
    }

    const currScouting: Array<currScoutingType> = [];
    const stats: Array<statsType> = [];

    // Get current scouting rate CSR, and ppl currently scouting
    let submitted = 0;
    for (const i of Object.keys(schedule["matches"][currQual-1])) {
      currScouting.push({stationId: i, scouting:
            (schedule["matches"][currQual-1][i].numScouting > 0)});

      if (schedule["matches"][currQual-1][i].submitted) {
        submitted += 1;
      }
    }

    stats.push({"CSR": Math.round(((submitted / 6) * 100)) + "%"});

    // Calculate OSR, overall submission rate
    submitted = 0;
    for (let i=0; i < maxQual; ++i) {
      for (const j of Object.keys(schedule["matches"][i])) {
        if (schedule["matches"][i][j].submitted) {
          submitted += 1;
        }
      }
    }

    stats.push({"OSR": Math.round(((submitted / (maxQual*6)) * 100)) + "%"});

    // Calculate LSS and MSS, least submitted station, most submitted station
    const stationCounts: {[index: string]: number} = {"R1": 0,
      "R2": 0, "R3": 0, "B1": 0, "B2": 0, "B3": 0};
    for (let i=0; i < maxQual; ++i) {
      for (const j of Object.keys(schedule["matches"][i])) {
        if (schedule["matches"][i][j].submitted) {
          stationCounts[j] += 1;
        }
      }
    }


    let min = "R1";
    let max = "R1";
    for (const i of Object.keys(stationCounts)) {
      if (stationCounts[i] > stationCounts[max]) {
        max = i;
      } else if (stationCounts[i] < stationCounts[max]) {
        min = i;
      }
    }

    stats.push({"LSS": min});
    stats.push({"MSS": max});

    res.status(200).json({"currScouting": currScouting, "stats": stats});
  }
}
