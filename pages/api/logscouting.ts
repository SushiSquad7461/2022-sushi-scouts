import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";

type Data = {
  result: string
}

/**
 * Log that a computer is scouting a team
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const matchNumString = req.query["matchNum"].toString();
  const matchType = req.query["matchType"];
  const station = req.query["station"];
  const code = req.query["code"];

  if (matchType.toString().toLowerCase() == "quals match") {
    await prisma.schedule.update({
      where: {
        match: {
          matchNum: parseInt(matchNumString),
          stationId: station,
          event: code,
        },
      },
      data: {
        numScouting: {increment: 1},
      },
    });

    res.status(200).json({result: "success"});
  } else {
    res.status(400).json({result: "only quals matches are supported"});
  }
}
