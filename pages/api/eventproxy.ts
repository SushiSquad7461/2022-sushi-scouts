import type {NextApiRequest, NextApiResponse} from "next";

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
    params.year === undefined) {
    res.status(400).json({error: "invalid parameters"});
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

    const data = await fetch(`https://frc-api.firstinspires.org/v2.0/${params.year}/events?`,
        requestOptions);

    if (data.ok) {
      const events = (await data.json()).Events;
      const ret = [];

      for (const i of events) {
        ret.push({name: i.name, code: i.code});
      }

      res.status(200).send(ret);
    } else {
      res.status(400).send({error: "Invalid Credentials"});
    }
  }
}
