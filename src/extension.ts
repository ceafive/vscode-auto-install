// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { spawn, execSync } from "child_process";
// import whichpm = require("../node_modules/which-pm");

type AutoInstallsOptions = {
  [key: string]: any;
};

const autoInstalls: AutoInstallsOptions = {};
const config = vscode.workspace.getConfiguration("autoInstaller");
let autoStart = config.startOnLaunch;

const startIfNeeded = () => {
  if (autoStart) {
    startAutoInstalls();
  }
};

const getWorkspacePaths = () =>
  vscode.workspace.workspaceFolders?.map((workspace) => workspace.uri.fsPath);

vscode.workspace.onDidChangeWorkspaceFolders(startIfNeeded);

const grabUserConfig = (config: string) => {
  let arg: string = "";
  if (vscode.workspace.getConfiguration("autoInstaller").config) {
    arg = `--${config}`;
  } else {
    arg = `--no-${config}`;
  }

  return arg;
};

const startAutoInstalls = () => {
  const args: string[] = [
    grabUserConfig("secure"),
    grabUserConfig("notify"),
    grabUserConfig("uninstall"),
  ];

  const outputConsole = vscode.window.createOutputChannel("Auto Installer");
  const outputToConsole = (data: string) => outputConsole.appendLine(data);

  autoStart = true;
  vscode.window.showInformationMessage("Starting Auto Installer");

  getWorkspacePaths()?.forEach(async (workspace: string) => {
    let showParseError = true;

    if (autoInstalls[workspace] !== null) {
      stopAutoInstall(workspace);
    }

    const autoInstall = spawn(`auto-install`, args, { cwd: workspace });

    autoInstalls[workspace] = autoInstall;

    autoInstall.stdout.on("data", (data: string) => {
      if (/npm init/.test(data)) {
        vscode.window.showErrorMessage(
          `Auto Install error: package.json is not found in the project root`
        );
      } else if (/Could not parse/.test(data) && showParseError) {
        showParseError = false;
        vscode.window.showErrorMessage(
          `Auto Install error: there are some errors parsing out files`
        );
      }

      outputToConsole("info: " + data);
    });

    autoInstall.stderr.on("data", (data: string) =>
      outputToConsole("error: " + data)
    );

    autoInstall.on("error", (err: string) => {
      outputToConsole(err);
      vscode.window.showErrorMessage(`Auto Installer error: ${err}`);
    });

    autoInstall.on("close", (code: string) => {
      outputToConsole("closing " + code);
      vscode.window.showInformationMessage("Auto Installer Stopped");
    });
  });
};

const stopAutoInstall = (workspace: string) => {
  if (autoInstalls[workspace]) {
    autoInstalls[workspace].kill();
  }
  autoInstalls[workspace] = null;
};

const stopAutoInstalls = () => {
  vscode.window.showInformationMessage("Stopping Auto Installer");
  getWorkspacePaths()?.forEach(stopAutoInstall);
  autoStart = false;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('"Auto-install" is now active!');

  const autoinstallURL = "https://github.com/ceafive/auto-install.git";
  execSync(`npm install -g ${autoinstallURL}`, { encoding: "utf8" });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  [
    {
      command: startAutoInstalls,
      name: "start",
    },
    {
      command: stopAutoInstalls,
      name: "stop",
    },
  ].forEach(({ command, name }) => {
    const commandToRegister = vscode.commands.registerCommand(
      `autoInstaller.${name}`,
      command
    );
    context.subscriptions.push(commandToRegister);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  stopAutoInstalls();
}

startIfNeeded();
