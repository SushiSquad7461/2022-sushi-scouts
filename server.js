#!/usr/bin/env node
const inquirer = require("inquirer")
const fs = require("fs");
let kill  = require('tree-kill');
let config = require("./data/teamconfig.json");
const { spawn } = require("child_process");
const colors = require('colors');
const fetch = require('node-fetch');

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
const httpTerminator = require("http-terminator");
const { default: Head } = require("next/head");

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
  }, {
    name: 'year',
    type: 'input',
    message: 'What is the year of the FRC game you are participating in?',
    validate: input => {
      return !isNaN(parseInt(input)) ? true : "Invalid input";
    },
    filter: input => { return !isNaN(parseInt(input)) ?parseInt(input) : input; }
  }]);

  answers.gotData = true;

  config = answers;

  fs.writeFile("./data/teamconfig.json", JSON.stringify(answers), () => {});
}

async function loadCompData() {
  console.log("DISCLAIMER: This features require that you enter in your credentials for the First Inspires API (https://frc-events.firstinspires.org/services/api), these credentials will not be stored");

  const answers = await inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'What is your username?',
  }, {
    name: 'password',
    type: 'input',
    message: 'What is your password?',
  }]);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic " + Buffer.from(answers.username + ":" + answers.password).toString('base64'));
  myHeaders.append("If-Modified-Since", "");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const res = await fetch(`https://frc-api.firstinspires.org/v2.0/${config.year}/events?districtCode=${config.districtCode}&teamNumber=${config.teamNumber}`,
    requestOptions);

  if (!res.ok) {
    console.log("Invalid Username or Password");
  } else {
    const DATA = await res.json();
    config.events = DATA.Events;
    fs.writeFile("./data/teamconfig.json", JSON.stringify(config), () => {});

    console.log("\nThe following events were found:")
    for (let i of config.events) {
      console.log(i.name);
    }
  }

  console.log();
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

  if (!fs.existsSync("./package.json")) {
    console.log("Repo not found, cloning...");

    const exportData = await spawn("git", ["clone", "https://github.com/SushiSquad7461/2022-sushi-scouts.git"]);

    exportData.on("close", code => {
        console.log(`\nRepo Cloned...`);
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
    console.log("Welcome back Team " + config.teamNumber);
  }

  console.log("\n\n");

  let input = "";
  let serverRunning = false;

  while (input !== "Quit") {
    const answers = await inquirer.prompt({
      name: "choice",
      message: "Enter a command you want to run: ",
      type: "list",
      choices: ["Run App", "Stop App", "Export Data to CSV", "Reset Team Info", "Load Comp Data (firstinpires api access required)", "Quit"]
    });

    input = answers.choice;

    console.log();

    if (input === "Run App") {
      try {
        startServer();
      } catch (e) {
        console.log(e);
      }
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
    } else if (input === "Load Comp Data (firstinpires api access required)") {
      await loadCompData();
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