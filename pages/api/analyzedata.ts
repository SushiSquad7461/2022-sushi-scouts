import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";

/**
 * Returns all of the events in first inspires api
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  const params = req.body;

  if (params.username === undefined ||
    params.password === undefined ||
    params.year === undefined ||
    params.code === undefined) {
    res.status(400).json({result: "invalid parameters"});
  } else {
    const myHeaders = new Headers();
    myHeaders.append("Authorization",
        "Basic " +
        Buffer.from(params.username + ":" +
        params.password).toString("base64"));
    myHeaders.append("If-Modified-Since", "");

    const requestOptions = {
      "method": "GET",
      "headers": myHeaders,
    };

    const data = await fetch(`https://frc-api.firstinspires.org/v2.0/${params.year}/scores/${params.code}/qual`,
        requestOptions);

    if (data.ok) {
      const matchResults = (await data.json()).MatchScores;
      const analysis: {[index: string]: string} = {};

      for (const i of matchResults) {
        const scoutingMatchResults = await prisma.matchdata.findMany({
          where: {
            matchNum: i.matchNumber,
            comp: params.code,
          },
        });

        if (scoutingMatchResults.length > 0) {
          let redCargo = 0;
          let blueCargo = 0;

          for (const j of scoutingMatchResults) {
            if (j.stationId[0] === "B") {
              blueCargo += j.auto_lowHub + j.auto_upperHub +
                j.teleop_lowHub + j.teleop_highHub;
            } else {
              redCargo += j.auto_lowHub + j.auto_upperHub +
                j.teleop_lowHub + j.teleop_highHub;
            }
          }

          analysis["Red " + i.matchNumber] = (redCargo /
            i.alliances[1].matchCargoTotal).toString();
          analysis["Blue " + i.matchNumber] = (blueCargo /
            i.alliances[0].matchCargoTotal).toString();
        }
      }

      res.status(200).send(analysis);
    } else {
      res.status(400).send({result: "Invalid Credentials"});
    }
  }
}
