import type {NextApiRequest, NextApiResponse} from 'next';

type MatchSchedule = {
  [index: string] : string[][]
}

type ScoutedRobot = {
  [index: string] : number
}

// Get match schedule
const schedule: MatchSchedule = require('../../data/matchschedule.json');

// List of the index that needs to be scouted
const scouted: ScoutedRobot = {};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
  // Get the current match number, the the type of match (Quarter Finals, Finals, etc...)
  const match_num_string = req.query['matchNum'];
  const match_type = req.query['matchType'];
  const match_type_lower = match_type.toString().toLowerCase();
  const match_num = parseInt(match_num_string.toString());

  // List of robots in current match match
  let competitors: string[] = [];

  if (match_num > schedule[match_type_lower].length) {
    // Match number is not in schedule, get last match in schedule
    competitors = schedule[match_type_lower][schedule[match_type_lower].length-1];
  } else if (match_num <= 0) {
    // Match number is not in schedule, get first match in schedule
    competitors = schedule[match_type_lower][0];
  } else {
    // Get current robots in match
    competitors = schedule[match_type_lower][match_num-1];
  }

  const match_id = match_num_string + match_type.toString();
  if (scouted[match_id] === undefined || scouted[match_id] >= 6) {
    scouted[match_id] = 1;
  } else {
    scouted[match_id] += 1;
  }

  // Send the team number
  res.status(200).send(competitors[scouted[match_id] - 1]);
}
