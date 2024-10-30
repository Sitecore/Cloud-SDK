// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import * as commands from './commands';

type AvailableCommands = Array<keyof typeof commands>;

export function loadCommands(commandsToLoad: AvailableCommands) {
  commandsToLoad.forEach((command) => {
    commands[command]();
  });
}
