#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const { spawn } = require("child_process");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const config = require("./data/teamconfig.json");
const { promisify } = require("util");
const { stringify } = require("csv-stringify/sync");

const dev = false;
const hostname = "localhost";
const port = 3000;

const FRCDistrictCodes = ["CHS", "FIM", "TX", "IN", "IRS", "FMA", "FNC", "NE", "ONT", "PNW", "PHC"];

/**
 * Collect team data
 */
async function collectTeamData() {
  const answers = await inquirer.prompt([{
    name: "teamNumber",
    type: "input",
    message: "What is your team number?",
    validate: input => !isNaN(parseInt(input)) ? true : "Invalid input",
    filter: input => !isNaN(parseInt(input)) ? parseInt(input) : input
  }, {
    name: "districtCode",
    message: "What is your team's district code?",
    type: "list",
    choices: FRCDistrictCodes
  }]);

  answers.gotData = true;

  config = answers;

  fs.writeFile("./data/teamconfig.json", JSON.stringify(answers), () => {});
}

async function startServer() {
  // when using middleware `hostname` and `port` must be provided below
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  return createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a" || pathname === "/b") {
        await app.render(req, res, pathname, query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) {
      throw err;
    }

    console.log(`\n> Ready on http://${hostname}:${port}`);
  });
}

function exportData() {
  return new Promise((resolve, reject) => {
    spawn("python3", ["./data/anylizedata.py"])
      .on("close", (code) => {
        resolve(code);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function exportDataNative() {
  const readFileAsync = promisify(fs.readFile);
  const writeFileAsync = promisify(fs.writeFile);

  const MATCH_JSON_FILE = "./data/matchdata.json";
  const MATCH_CSV_FILE = "./data/matchdata.csv";

  const jsonFile = await readFileAsync(MATCH_JSON_FILE);

  // This is a bit dangerous as it makes assumptions about the format of the JSON file.
  const { matchData } = JSON.parse(jsonFile.toString());

  const headers = Object.keys(matchData[0]);
  const allValues = matchData.map((match) => Object.values(match));

  const csvOutput = stringify([
    headers,
    ...allValues,
  ]);

  await writeFileAsync(MATCH_CSV_FILE, csvOutput);
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
    }
  }

  server?.close();
})();
