#!/usr/bin/env node

const { execSync } = require("child_process");
/**
 *
 * @param {String} command
 * @returns {Boolean}
 */
const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};
const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/jeansamist/create-iris-app ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log("Clonning the repository");
const checkout = runCommand(gitCheckoutCommand);
if (!checkout) process.exit(-1);
console.log("Installing dependencies");
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);
console.log("Project is ready");
