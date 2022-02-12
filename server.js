#!/usr/bin/env node
const inquirer = require("inquirer")
const fs = require("fs");
let kill  = require('tree-kill');
const config = require("./data/teamconfig.json");
const { spawn } = require("child_process");
const colors = require('colors');

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const dev = false;
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const FRCDistrictCodes = ["CHS", "FIM", "TX", "IN", "IRS", "FMA", "FNC", "NE", "ONT", "PNW", "PHC"]
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const httpTerminator = require("http-terminator")

const server = createServer(async (req, res) => {
  try {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      await app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      await app.render(req, res, '/b', query)
    } else {
      await handle(req, res, parsedUrl)
    }
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('internal server error')
  }
});

async function collectTeamData() {
  const answers = await inquirer.prompt([{
    name: 'teamNumber',
    type: 'input',
    message: 'What is your team number?',
    validate: input => {
      return !isNaN(parseInt(input)) ? true : "Invalid input";
    },
    filter: input => { return !isNaN(parseInt(input)) ?parseInt(input) : input; }
  }, {
   name: "districtCode",
  message: "What is your teams district code?",
   type: "list",
   choices: FRCDistrictCodes
  }]);

  answers.gotData = true;

  fs.writeFile("./data/teamconfig.json", JSON.stringify(answers), () => {});
}

function startServer() {
  app.prepare().then(() => {
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`\n> Ready on http://${hostname}:${port}`)
    });
  })
}

(async () => {
  console.clear();

  console.log("Welcome to Sushi Scouts....");

  await sleep(1000);
  
  console.log();

  if (!config.gotData) {
    await collectTeamData();
  } else {
    console.log("Welcome back Team " + config.teamNumber);
  }

  console.log("\n\n");

  let input = "";
  let serverRunning = false;

  while (input !== "Quit") {
    console.log();
    const answers = await inquirer.prompt({
      name: "choice",
      message: "Enter a command you want to run: ",
      type: "list",
      choices: ["Run App", "Stop App", "Export Data to CSV", "Reset Team Info", "Quit"]
    });

    input = answers.choice;

    console.log();

    if (input === "Run App") {
      startServer();
      serverRunning = true;
    } else if (input === "Stop App" && serverRunning) {
      console.log("waiting for all users to close app.....")
      const terminate = httpTerminator.createHttpTerminator({
        server,
      });
      
      await terminate.terminate();    

      serverRunning = false;
    } else if (input === "Export Data to CSV") {
        console.log("Exporting data");
        const exportData = spawn("py", ["./data/anylizedata.py"]);

        exportData.on("close", code => {
            console.log(`\nExport Shutting Down...`);
        });
    } else if (input === "Reset Team Info") {
      await collectTeamData();
    }
  }

  if (serverRunning) {
    console.log("waiting for all users to close app.....")

    const terminate = httpTerminator.createHttpTerminator({
      server,
    });
    
    await terminate.terminate();    
  }
})();