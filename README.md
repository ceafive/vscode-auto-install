# Auto Installer for VS Code

This is a VS Code extenstion to start and stop `ceafive/auto-install` which installs and erases dependencies as you write your code.

## Usage
Run the 'Start Auto Installer' command or set the autoInstaller.startOnLaunch to `true` in the configuration

## Features

Installs or uninstalls dependencies as you type. It installs dependencies that are found in `*.test.js` or `*.spec.js` under `devDependencies`

![Auto installs dependencies as you code](https://raw.githubusercontent.com/siddharthkp/auto-install/master/demo.gif)

Starts by default when it detects package.json in the root if autoInstall.startOnLaunch is true.
By default installs only packages that have >10k monthly downloads.

Checkout `ceafive/auto-install` for the details.

## Requirements

Only requires `ceafive/auto-install`. This module will be installed automatically globally.

## Extension Settings

This extension contributes the following settings:

* `autoInstaller.startOnLaunch`: Starts Auto Installer automatically if workspace has `package.json` in the root. Default: `false`

* `autoInstaller.secure`: If set to `true`, Auto Installer will only install packages with >10k monthly downloads. see `ceafive\auto-install` secure flag. Default: `false`

* `autoInstaller.notify`: If set to false, Auto Installer will not show notifications for installed or uninstalled packages. Default: `true` 

* `autoInstaller.uninstall`: If set to true, Auto Installer will not show automatically uninstall packages when they are removed from code. Default: `false` 

## Known Issues

Cannot be used in a repo with multiple `package.json` files. Will be fixed soon.

## Release Notes

## [1.2.1]
Rewritten with TypeScript

## [1.0.1]
Display parsing errors

### 1.0.0

Initial release