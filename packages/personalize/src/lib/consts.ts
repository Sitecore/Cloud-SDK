// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable @typescript-eslint/naming-convention */
import packageJson from '../../package.json';

/**
 * Returns the version of the library.
 */
export const LIBRARY_VERSION = packageJson.version;

export enum ErrorMessages {
  IE_0001 = '[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.',
  IE_0006 = '[IE-0006] You must first initialize the "personalize/browser" module. Run the "init" function.',
  IE_0007 = '[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.',
  MV_0004 = '[MV-0004] "friendlyId" is required.',
}

/**
 * Returns the namespace of the library.
 */
export const PERSONALIZE_NAMESPACE = 'sitecore-cloudsdk:personalize' as const;
export const UTM_PREFIX = 'utm_';
