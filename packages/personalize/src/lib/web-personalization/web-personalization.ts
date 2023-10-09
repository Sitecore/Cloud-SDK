// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';
import { appendScriptWithAttributes } from '../utils/appendScriptWithAttributes';

/**
 * Adds the functionality in order the web experiences library to work.
 * @param pluginConfiguration - The plugin configuration
 * @param requiredSettings - An object with basic input settings that are also required by the current
 * or any other plugin
 */
// eslint-disable-next-line import/no-default-export
export function webPersonalization(
  pluginConfiguration: boolean | IWebPersonalizationConfig,
  requiredSettings: ISettingsParamsBrowser
) {
  if (!requiredSettings.pointOfSale) throw new Error('[MV-0003] "pointOfSale" is required.');
  if (requiredSettings.pointOfSale.trim().length === 0) throw new Error('[MV-0009] "pointOfSale" cannot be empty.');

  const webFlowTarget = 'https://d35vb5cccm4xzp.cloudfront.net';
  const webExperienceSettings: IWebExperiencesSettings = {
    /* eslint-disable @typescript-eslint/naming-convention */
    client_key: requiredSettings.clientKey,
    pointOfSale: requiredSettings.pointOfSale,
    targetURL: requiredSettings.targetURL,
    web_flow_config: {
      async:
        (pluginConfiguration as IWebPersonalizationConfig).asyncScriptLoading !== undefined
          ? ((pluginConfiguration as IWebPersonalizationConfig).asyncScriptLoading as boolean)
          : true,
      defer: (pluginConfiguration as IWebPersonalizationConfig).deferScriptLoading ?? false,
    },
    web_flow_target: (pluginConfiguration as IWebPersonalizationConfig).baseURLOverride ?? webFlowTarget,
  };

  window.Engage.settings = webExperienceSettings;

  // eslint-disable-next-line max-len
  const scriptSrcAttribute = `${webExperienceSettings.web_flow_target}/web-flow-libs/${webExperienceSettings.client_key}/web-version.min.js`;

  appendScriptWithAttributes({ async: webExperienceSettings.web_flow_config.async, src: scriptSrcAttribute });
}

export interface IWebExperiencesSettings {
  /* eslint-disable @typescript-eslint/naming-convention */
  targetURL: string;
  pointOfSale: string;
  client_key: string;
  web_flow_config: {
    async: boolean;
    defer: boolean;
  };
  web_flow_target?: string;
  /* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Properties for the Web Flow configuration
 */
export interface IWebPersonalizationConfig {
  asyncScriptLoading?: boolean;
  deferScriptLoading?: boolean;
  baseURLOverride?: string;
}
