#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const {spawn} = require("child_process");
const {createServer} = require("http");
const {parse} = require("url");
const next = require("next");

const config = require("./data/teamconfig.json");
const {promisify} = require("util");
const {stringify} = require("csv-stringify/sync");

const year = "2022";
const dev = true;
const hostname = "localhost";
const port = 3000;

const FRCDistrictCodes =
 ["CHS", "FIM", "TX", "IN", "IRS", "FMA", "FNC", "NE", "ONT", "PNW", "PHC"];

/**
 * Collect team data
 */
async function collectTeamData() {
  const answers = await inquirer.prompt([{
    name: "teamNumber",
    type: "input",
    message: "What is your team number?",
    validate: (input) => !isNaN(parseInt(input)) ? true : "Invalid input",
    filter: (input) => !isNaN(parseInt(input)) ? parseInt(input) : input,
  }, {
    name: "districtCode",
    message: "What is your team's district code?",
    type: "list",
    choices: FRCDistrictCodes,
  }]);

  answers.gotData = true;

  config = answers;

  fs.writeFile("./data/teamconfig.json", JSON.stringify(answers), () => {});
}

/**
 * Load data for comps from first inspires
 */
async function loadTeamData() {
  console.log("DISCLAIMER: This features require that you enter in your credentials for the First Inspires API (https://frc-events.firstinspires.org/services/api), these credentials will not be stored");

  const answers = await inquirer.prompt([{
    name: "username",
    type: "input",
    message: "What is your username?",
  }, {
    name: "password",
    type: "input",
    message: "What is your password?",
  }]);

  const myHeaders = new Headers();
  myHeaders.append("Authorization",
      "Basic " +
    Buffer.from(answers.username + ":" + answers.password).toString("base64"));
  myHeaders.append("If-Modified-Since", "");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = await fetch(`https://frc-api.firstinspires.org/v2.0/${config.year}/events?districtCode=${config.districtCode}&teamNumber=${config.teamNumber}`,
      requestOptions);

  if (!res.ok) {
    console.log("Invalid Username or Password");
  } else {
    const DATA = await res.json();
    config.events = DATA.Events;
    fs.writeFile("./data/teamconfig.json", JSON.stringify(config), () => {});

    console.log("\nThe following events were found:");
    for (const i of config.events) {
      console.log(i.name);
    }
  }

  console.log();
}

/**
 * Creates new scouting app server
 * @return {Server} server
 */
async function startServer() {
  // when using middleware `hostname` and `port` must be provided below
  const app = next({dev, hostname, port});
  const handle = app.getRequestHandler();
  console.log("hello?3");

  try {
    await app.prepare();
  } catch (e) {
    console.log(e);
  }

  console.log("hello?5");

  return createServer(async (req, res) => {
    console.log("bob3");

    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const {pathname, query} = parsedUrl;

      console.log("bob");
      if (pathname === "/a" || pathname === "/b") {
        await app.render(req, res, pathname, query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.log("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) {
      console.log("error?");
      throw err;
    }

    console.log(`\n> Ready on http://${hostname}:${port}`);
  });
}

/**
 * Export data from json to CSV
 */
async function exportDataNative() {
  const readFileAsync = promisify(fs.readFile);
  const writeFileAsync = promisify(fs.writeFile);

  const MATCH_JSON_FILE = "./data/matchdata.json";
  const MATCH_CSV_FILE = "./data/matchdata.csv";

  const jsonFile = await readFileAsync(MATCH_JSON_FILE);

  // This is a bit dangerous as it makes
  // assumptions about the format of the JSON file.
  const {matchData} = JSON.parse(jsonFile.toString());

  const headers = Object.keys(matchData[0]);
  const allValues = matchData.map((match) => Object.values(match));

  const csvOutput = stringify([
    headers,
    ...allValues,
  ]);

  await writeFileAsync(MATCH_CSV_FILE, csvOutput);
}

/**
 * Gets data about comp schedule
 */
async function loadCompData() {
  let id = await inquirer.prompt([
    {
      name: "answer",
      type: "input",
      message: "Enter the event id",
    },
  ]);
  id = id.answer;
  let user = await inquirer.prompt([
    {
      name: "answer",
      type: "input",
      message: "Enter your username for the api",
    },
  ]);
  user = user.answer;
  let password = await inquirer.prompt([
    {
      name: "answer",
      type: "input",
      message: "Enter your api key",
    },
  ]);
  password = password.answer;
  const encodedToken = "Basic " + btoa(`${user}:${password}`);
  const url = `https://frc-api.firstinspires.org/v2.0/${year}/schedule/${id}?tournamentLevel=qual`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": encodedToken,
    },
  }).then((response) => response.json());

  const length = response["Schedule"].length;
  console.log(length);
  const schedule = {"matches": []};
  for (i=0; i<length; i++) {
    const currmatch = response["Schedule"][i];
    const r1 = currmatch["teams"][0]["teamNumber"];
    const r2 = currmatch["teams"][1]["teamNumber"];
    const r3 = currmatch["teams"][2]["teamNumber"];
    const b1 = currmatch["teams"][3]["teamNumber"];
    const b2 = currmatch["teams"][4]["teamNumber"];
    const b3 = currmatch["teams"][5]["teamNumber"];

    const match = {
      "r1": {teamNumber: r1, numScouting: 0, submitted: false},
      "r2": {teamNumber: r2, numScouting: 0, submitted: false},
      "r3": {teamNumber: r3, numScouting: 0, submitted: false},
      "b1": {teamNumber: b1, numScouting: 0, submitted: false},
      "b2": {teamNumber: b2, numScouting: 0, submitted: false},
      "b3": {teamNumber: b3, numScouting: 0, submitted: false},
    };
    schedule["matches"].push(match);
  }
  fs.writeFile("./data/matchschedule.json", JSON.stringify(schedule, null, 2),
      (err) => {
        if (err) {
          console.error(err); return;
        };
        console.log("Created match schedule");
      });
}

(async () => {
  console.clear();

  console.log("Welcome to Sushi Scouts....");

  console.log();

  if (!fs.existsSync("./package.json")) {
    console.log("Repo not found, cloning...");

    const exportData = await spawn("git", ["clone", "https://github.com/SushiSquad7461/2022-sushi-scouts.git"]);

    exportData.on("close", (code) => {
      console.log("\nRepo Cloned...");
      console.log("Run the following commands:");
      console.log("cd ./2022-sushi-scouts");
      console.log("npm i");
      console.log("npm run build");
      console.log("npx sushiscouts");
    });

    return undefined;
  }

  if (!config.gotData) {
    await collectTeamData();
  } else {
    console.log(`Welcome back Team ${config.teamNumber}`);
  }

  console.log("\n\n");

  let input = "";
  let server;

  while (input !== "Quit") {
    const answers = await inquirer.prompt({
      name: "choice",
      message: "Enter a command you want to run: ",
      type: "list",
      choices: ["Run App", "Stop App",
        "Export Data to CSV", "Reset Team Info",
        "Load Comp Data (firstinpires api access required)",
        "Load Team Data (firstinpires api access required)",
        "Quit"],
    });

    input = answers.choice;

    console.log();

    if (input === "Run App") {
      server = await startServer();
    } else if (input === "Stop App" && server) {
      server.close();
    } else if (input === "Export Data to CSV") {
      console.log("Exporting data");
      await exportDataNative();
      console.log("Export complete!");
    } else if (input === "Reset Team Info") {
      await collectTeamData();
    } else if (input === "Load Comp Data (firstinpires api access required)") {
      await loadCompData();
    } else if (input === "Load Team Data (firstinpires api access required)") {
      await loadTeamData();
    }
  }

  server?.close();
})();
