import type {NextApiRequest, NextApiResponse} from "next";

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  let teamNum = "0000";
  // Get the current match number, the the type of match (Finals, etc...)
  const matchNumString = req.query["matchNum"];
  const matchType = req.query["matchType"];
  const station = req.query["station"];

  if (matchType.toString().toLowerCase() == "quals match") {
    try {
      const schedule = require("../../data/matchschedule.json");
      teamNum = schedule["matches"][
          parseInt(matchNumString.toString())-1][station.
          toString()]["teamNumber"];
    } catch (err) {
      console.error(`Error reading file from disk: ${err}`);
      res.status(500).json({
        err: "Error reading from file, try again later",
      });
    }
  }

  // Send the team number
  res.status(200).json({
    num: teamNum,
  });
}
