import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";

/**
 * Returns all of the comps in the current database
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  const matchData = await prisma.matchdata.findMany({
    select: {
      comp: true,
    },
  });

  const allValues = matchData.map((match: { [s: string]: string; } |
    ArrayLike<string>) => Object.values(match));

  const uniqueComps: Array<string> = [];

  for (const i of allValues) {
    if (!uniqueComps.includes(i[0])) {
      uniqueComps.push(i[0]);
    }
  }
  res.status(200).send(uniqueComps);
}
