import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";

type Data = {
  result: string
}

/**
 * Adds scouting info to database
 * @param {NextApiRequest} req Api request object
 * @param {NextApiResponse} res Api response object
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
  const matchData = req.body;
  const matchType = matchData["match info:match type"];
  const matchNum = parseInt(matchData["match info:match #"]);
  const stationId = matchData["match info:station id"];
  const comp = matchData["comp"];

  if (matchType.toLowerCase() == "quals match") {
    await prisma.schedule.update({
      where: {
        match: {
          matchNum: matchNum,
          stationId: stationId,
          event: comp,
        },
      },
      data: {
        completed: true,
      },
    });
  }

  const data = {
    "teamNumber": matchData["teamNumber"],
    "name": matchData["match info:ur name"],
    "comp": matchData["comp"],
    "matchNum": parseInt(matchData["match info:match #"]),
    "matchType": matchData["match info:match type"],
    "teamScouted": parseInt(matchData["match info:team # you're scouting"]),
    "stationId": matchData["match info:station id"],
    "auto_show": matchData["auto:no show"],
    "auto_move": matchData["auto:move off tarmac"],
    "auto_lowHub": matchData["auto:scored lower hub"],
    "auto_humanPlayer": matchData["auto:scored by hp"],
    "auto_upperHub": matchData["auto:scored upper hub"],
    "shootAnywhere": matchData["teleop:shoot anywhere"],
    "swerveDrive": matchData["teleop:swerve drive"],
    "teleop_lowHub": matchData["teleop:scored lower hub"],
    "teleop_highHub": matchData["teleop:scored upper hub"],
    "end_climb": matchData["end game:climb"],
    "end_climbLevel": matchData["end game:climb type"],
    "end_defense": matchData["end game:defense"],
    "end_notes": matchData["end game:notes"],
  };

  await prisma.matchdata.upsert({
    where: {
      matchid: {
        teamScouted: data.teamScouted,
        comp: data.comp,
        stationId: data.stationId,
        matchNum: data.matchNum,
      },
    },
    update: data,
    create: data,
  });

  // Successfully added data
  res.status(200).json({result: "success"});
}
