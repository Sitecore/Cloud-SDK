// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';

/**
 * A function that iterates through noted plugins and settings
 * and loads the retrieved plugins for engage. The plugins should be in form of functions.
 * @param settingsInput - The settings input from the developer
 */
export async function loadPlugins(settingsInput: ISettingsParamsBrowser) {
  let count = 0;
  const availablePluginsKeys = Object.keys(AvailablePlugins);
  const requiredSettings = {
    clientKey: settingsInput.clientKey,
    pointOfSale: settingsInput.pointOfSale,
    targetURL: settingsInput.targetURL,
  };
  for await (const key of availablePluginsKeys) {
    const pluginValue = settingsInput[key as keyof typeof settingsInput];

    if (!pluginValue) continue;

    const module = await import(`./plugins/${AvailablePlugins[key as keyof typeof AvailablePlugins]}.ts`);
    const plugin = module.default;

    await plugin(pluginValue, requiredSettings);
    count++;
  }

  return Promise.resolve(`${count} plugins loaded`);
}

/**
 * enum with all available plugins
 * The path should be relative to the load-plugins.ts file
 * The name of each key should correspond to the property of the equivalent input setting
 */
export enum AvailablePlugins {
  webPersonalization = 'web-personalization',
}
