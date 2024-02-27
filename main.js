#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const {
  intro,
  outro,
  isCancel,
  cancel,
  text,
  confirm,
  spinner,
} = require("@clack/prompts");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
const initProject = (name) => {
  const s = spinner();
  const gitCheckoutCommand = `git clone --depth 1 https://github.com/jeansamist/iris-app-template ${name}`;
  const installDepsCommand = `cd ${name} && npm install`;

  s.start("Clonning the repository");
  const checkout = runCommand(gitCheckoutCommand);
  if (!checkout) process.exit(-1);
  s.stop("Repository clonned");

  const pkg = path.join(path.join(__dirname, name), "package.json");
  const json = JSON.parse(fs.readFileSync(pkg, "utf8"));
  json["name"] = name;
  json["version"] = "0.0.1";
  fs.writeFileSync(pkg, JSON.stringify(json, null, 2), "utf8");

  s.start("Installing dependencies usin npm");
  const installedDeps = runCommand(installDepsCommand);
  if (!installedDeps) process.exit(-1);
  s.stop("Installed via npm");

  outro("Project is ready");
};
const repoName = process.argv[2];
intro(`
██ ██████  ██ ███████      █████  ██████  ██████  
██ ██   ██ ██ ██          ██   ██ ██   ██ ██   ██ 
██ ██████  ██ ███████     ███████ ██████  ██████  
██ ██   ██ ██      ██     ██   ██ ██      ██      
██ ██   ██ ██ ███████     ██   ██ ██      ██      
                                                  
                                                  
Create by @jeansamist
`);
if (repoName === undefined) {
  text({
    message: "Project name",
    validate: (value) => {
      const pattern =
        /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;

      if (!pattern.test(value)) {
        return "Text does not match the pattern";
      }
    },
  }).then((name) => {
    if (isCancel(name)) {
      cancel("Operation cancelled.");
      process.exit(0);
    } else {
      confirm({
        message:
          "Do you want to create an iris app with the name : " + name + " ?",
      }).then((_continue) => {
        if (_continue) {
          initProject(name);
        } else {
          cancel("Operation cancelled.");
          process.exit(0);
        }
      });
    }
  });
} else {
  initProject(repoName);
}
