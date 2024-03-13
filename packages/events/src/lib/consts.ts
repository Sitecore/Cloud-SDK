// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
/* eslint-disable @typescript-eslint/naming-convention */
import packageJson from '../../package.json';
import { MAX_EXT_ATTRIBUTES } from './events/consts';

/**
 * Returns the version of the library.
 */
export const LIBRARY_VERSION = packageJson.version;

export enum ErrorMessages {
  IE_0001 = `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`,
  IE_0004 = '[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.',
  IE_0005 = '[IE-0005] You must first initialize the "events/server" module. Run the "init" function.',
  IV_0002 = '[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.',
  IV_0003 = '[IV-0003] Incorrect value for "email". Set the value to a valid email address.',
  IV_0004 = '[IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601.',
  IV_0005 = `[IV-0005] This event supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`,
  MV_0003 = '[MV-0003] "identifiers" is required.',
}

export const EVENTS_NAMESPACE = 'sitecore-cloudsdk:events';
 