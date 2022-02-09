#!/usr/bin/env node
const inquirer = require("inquirer")
const fs = require("fs");
let kill  = require('tree-kill');
const config = require("../data/teamconfig.json");
const { spawn } = require("child_process");
const colors = require('colors');

const FRCDistrictCodes = ["CHS", "FIM", "TX", "IN", "IRS", "FMA", "FNC", "NE", "ONT", "PNW", "PHC"]
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      } else if (stdout) {
        console.log(stdout); 
      } else {
        console.log(stderr);
      }
      resolve(stdout ? true : false);
    });
  });
}

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

  let sushiScouts;
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
      console.log("Starting up Sushi Scouts....")
      // execShellCommand("npm run dev");

      sushiScouts = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["run", "dev"]);

      sushiScouts.stdout.on("data", data => {
          console.log(`\nSushi Scouts Console: ${data}`.green);
      });

      sushiScouts.stderr.on("data", data => {
          console.log(`\nSushi Scouts Warning: ${data}`.blue);
      });

      sushiScouts.on('error', (error) => {
          console.log(`\nSushi Scouts Error: ${error.message}`.blue);
      });

      sushiScouts.on("close", code => {
          console.log(`\nStopping Sushi Scouts....`);
      });
    } else if (input === "Stop App" && sushiScouts !== undefined) {
      kill(sushiScouts.pid);
    } else if (input === "Export Data to CSV") {
        const exportData = spawn("py", ["./data/anylizedata.py"]);

        exportData.on("close", code => {
            console.log(`\nExport Shutting Down...`);
        });
    } else if (input === "Reset Team Info") {
      await collectTeamData();
    }
  }


  // Cleanup
  if (sushiScouts !== undefined) {
    kill(sushiScouts.pid);
  }

})();