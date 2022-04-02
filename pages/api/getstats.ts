import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";

export type currScoutingType = {
        stationId: string,
        scouting: boolean,
        submitted: boolean
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
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const currQual: number = parseInt(req.query["currQual"].toString());
  const maxQual: number = parseInt(req.query["maxQual"].toString());
  const code: string = req.query["code"].toString();

  if (isNaN(currQual) || isNaN(maxQual) || code === null) {
    res.status(400).json({"currScouting": [], "stats": []});
  } else {
    const currScouting: Array<currScoutingType> = [];
    const stats: Array<statsType> = [];

    // Get current scouting rate CSR, and ppl currently scouting
    const submittedCurrQual = await prisma.schedule.findMany({
      where: {
        matchNum: currQual,
        completed: true,
        event: code,
      },
    });
    stats.push({"CSR": Math.round((submittedCurrQual.length / 6) * 100) + "%"});

    // Calculate OSR, overall submission rate
    const submittedOverall = await prisma.schedule.findMany({
      where: {
        matchNum: {
          lte: maxQual,
        },
        completed: true,
        event: code,
      },
    });

    stats.push({"OSR": Math.round(((submittedOverall.length /
      (maxQual*6)) * 100)) + "%"});

    // Calculate LSS and MSS, least submitted station, most submitted station
    const stationCounts: {[index: string]: number} = {"R1": 0,
      "R2": 0, "R3": 0, "B1": 0, "B2": 0, "B3": 0};

    const allSubmitedEntries = await prisma.schedule.findMany({
      where: {
        matchNum: {
          lte: maxQual,
        },
        completed: true,
        event: code,
      },
    });

    for (let i=0; i < allSubmitedEntries.length; ++i) {
      stationCounts[allSubmitedEntries[i].stationId] += 1;
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
    stats.push({"R1": stationCounts.R1.toString()});
    stats.push({"R2": stationCounts.R2.toString()});
    stats.push({"R3": stationCounts.R3.toString()});
    stats.push({"B1": stationCounts.B1.toString()});
    stats.push({"B2": stationCounts.B2.toString()});
    stats.push({"B3": stationCounts.B3.toString()});

    // Get curr scouting
    const currMatches = await prisma.schedule.findMany({
      where: {
        matchNum: currQual,
        event: code,
      },
    });

    for (const i of currMatches) {
      currScouting.push({stationId: i.stationId,
        scouting: i.numScouting > 1, submitted: i.completed});
    }

    res.status(200).json({"currScouting": currScouting, "stats": stats});
  }
}
