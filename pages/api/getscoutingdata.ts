import type {NextApiRequest, NextApiResponse} from "next";
import users from "../../data/matchdata.json";

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  // Send scouting data
  res.status(200).json(users);
}
