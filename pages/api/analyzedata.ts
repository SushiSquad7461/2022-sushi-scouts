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
      const scoutingDataResults = await prisma.matchdata.findMany({
        where: {
          comp: params.code,
        },
      });

      res.status(200).send({result: "Success"});
    } else {
      res.status(400).send({result: "Invalid Credentials"});
    }
  }
}
