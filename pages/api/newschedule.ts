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

    const data = await fetch(`https://frc-api.firstinspires.org/v2.0/${params.year}/schedule/${params.code}?tournamentLevel=qual`,
        requestOptions);

    if (data.ok) {
      const events = (await data.json()).Schedule;
      for (const i of events) {
        for (const j of i.teams) {
          const stationId = j.station[0] + j.station[j.station.length-1];
          const data = {
            matchNum: i.matchNumber,
            stationId: stationId,
            teamNum: j.teamNumber,
            completed: false,
            numScouting: 0,
            event: params.code,
          };

          await prisma.schedule.upsert({
            where: {
              match: {
                event: params.code,
                matchNum: i.matchNumber,
                stationId: stationId,
              },
            },
            update: data,
            create: data,
          });
        }
      }

      res.status(200).send({result: "Success"});
    } else {
      res.status(400).send({result: "Invalid Credentials"});
    }
  }
}
