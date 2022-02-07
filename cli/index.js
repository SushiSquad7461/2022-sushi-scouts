#!/usr/bin/env node
const inquirer = require("inquirer")
const fs = require("fs");

const config = require("../data/teamconfig.json");

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

(async () => {
  console.clear();

  console.log("Welcome to Sushi Scouts....");
  
  await sleep(1000);
  
  if (!config.gotData) {
    const answers = await inquirer.prompt({
      name: 'player_name',
      type: 'input',
      message: 'What is your name?',
      default() {
          return 'Player';
      },
      });
  
      console.log(answers);
  
      config.gotData = true;
  } else {
    console.log("Welcome back");
  }
  
  fs.writeFile("./data/teamconfig.json", JSON.stringify(config), () => {});
  
  execShellCommand("npm run dev");
})();