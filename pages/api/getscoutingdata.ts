import type {NextApiRequest, NextApiResponse} from "next";
import {readFileSync} from "fs";
import {stringify} from "csv-stringify/sync";
const MATCH_JSON_FILE = "./data/matchdata.json";
import stream from "stream";
import {promisify} from "util";
import {PrismaClient} from "@prisma/client";

const pipeline = promisify(stream.pipeline);
const prisma = new PrismaClient()

/**
 * Assigns team number for computer to scout based on match schedule
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  const matchData = await prisma.matchdata.findMany();
  // const jsonFile = readFileSync(MATCH_JSON_FILE);

  // // This is a bit dangerous as it makes
  // // assumptions about the format of the JSON file.
  // const {matchData} = JSON.parse(jsonFile.toString());

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

  // Send scouting data
  // res.status(200).json({"data": csvOutput});
}
