import type {NextApiRequest, NextApiResponse} from "next";
import {stringify} from "csv-stringify/sync";
import stream from "stream";
import {promisify} from "util";
import {prisma} from "../../lib/prisma";
const pipeline = promisify(stream.pipeline);

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  const compSelection: string = req.query["comp"].toString();

  let matchData;

  if (compSelection === "All") {
    matchData = await prisma.matchdata.findMany();
  } else {
    matchData = await prisma.matchdata.findMany({
      where: {
        comp: compSelection,
      },
    });
  }

  const headers = Object.keys(matchData[0]);
  const allValues = matchData.map((match: { [s: string]: unknown; } |
    ArrayLike<unknown>) => Object.values(match));

  const csvOutput = stringify([
    headers,
    ...allValues,
  ]);

  res.setHeader("Content-Type", "application/text");
  res.setHeader("Content-Disposition", "attachment; filename=scoutingdata.csv");
  await pipeline(csvOutput, res);
}
