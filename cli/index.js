#!/usr/bin/env node
const inquirer = require("inquirer")
const fs = require("fs");

const config = require("../data/teamconfig.json");

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
  while (input !== "Quit") {
    const answers = await inquirer.prompt({
      name: "choice",
      message: "Enter a command you want to run: ",
      type: "list",
      choices: ["Run App", "Quit"]
    }).catch(err => console.log(err));

    input = answers.choice;

    if (intput === "Run App") {
      console.log("Satarting up Sushi Scouts....")
      execShellCommand("npm run dev");
    }
  }
  
})();