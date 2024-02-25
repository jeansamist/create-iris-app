#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

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
const pattern =
  /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;

if (pattern.test(repoName)) {
  const gitCheckoutCommand = `git clone --depth 1 https://github.com/jeansamist/create-iris-app ${repoName}`;
  const installDepsCommand = `cd ${repoName} && npm install`;

  console.log("Clonning the repository");
  const checkout = runCommand(gitCheckoutCommand);
  if (!checkout) process.exit(-1);

  const pkg = path.join(path.join(__dirname, ".."), "package.json");
  const json = JSON.parse(fs.readFileSync(pkg, "utf8"));
  json["name"] = repoName;
  json["version"] = "0.0.1";
  fs.writeFileSync(pkg, JSON.stringify(json, null, 2), "utf8");

  console.log("Installing dependencies");
  const installedDeps = runCommand(installDepsCommand);
  if (!installedDeps) process.exit(-1);

  console.log("Project is ready");
} else {
  console.log("Text does not match the pattern");
}
