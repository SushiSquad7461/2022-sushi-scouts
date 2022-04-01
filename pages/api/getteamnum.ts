import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";
/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  let teamNum = "0000";
  // Get the current match number, the the type of match (Finals, etc...)
  const matchNumString = req.query["matchNum"].toString();
  const matchType = req.query["matchType"];
  const station = req.query["station"];
  const code = req.query["code"];

  if (matchType.toString().toLowerCase() == "quals match") {
    const getMatch = await prisma.schedule.findUnique({
      where: {
        match: {
          matchNum: parseInt(matchNumString),
          stationId: station,
          event: code,
        },
      },
    });

    if (getMatch !== null) {
      teamNum = getMatch.teamNum;
    }
  }

  // Send the team number
  res.status(200).json({
    num: teamNum,
  });
}
