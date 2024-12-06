// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable @typescript-eslint/naming-convention */
import packageJson from '../../package.json';

export const PERSONALIZE_NAMESPACE = 'sitecore-cloudsdk:personalize' as const;
export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;
export const UTM_PREFIX = 'utm_';

export enum ErrorMessages {
  // eslint-disable-next-line max-len
  IE_0001 = `[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.`,
  IE_0006 = '[IE-0006] You must first initialize the "personalize/browser" module. Run the "init" function.',
  IE_0007 = '[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.',
  IE_0008 = '[IE-0008] You must first initialize the "core" package. Run the "init" function.',
  // eslint-disable-next-line max-len
  IE_0016 = '[IE-0016] You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/personalize/browser". Then, run "CloudSDK().addPersonalize().initialize()".',
  // eslint-disable-next-line max-len
  IE_0017 = '[IE-0017] You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/personalize/server". Then, run "await CloudSDK().addPersonalize().initialize()".',
  MV_0004 = '[MV-0004] "friendlyId" is required.'
}
