// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import packageJson from '../../package.json';

export const PACKAGE_NAME = packageJson.name;
export const SEARCH_NAMESPACE = 'sitecore-cloudsdk:search';

/* eslint-disable max-len */
export enum ErrorMessages {
  IE_0001 = `[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.`,
  IE_0009 = '[IE-0009] You must first initialize the "search-api-client/browser" package. Run the "init" function.',
  IE_0010 = '[IE-0010] You must first initialize the "search-api-client/server" package. Run the "init" function.',
  IE_0018 = '[IE-0018] - You must first initialize the Cloud SDK and the "search-api-client" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser", and import "@sitecore-cloudsdk/search-api-client/browser". Then, run "CloudSDK().addEvents().addSearch().initialize()".',
  IE_0019 = '[IE-0019] - You must first initialize the Cloud SDK and the "search-api-client" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/search-api-client/server". Then, run "await CloudSDK().addEvents().addSearch().initialize()".',
  IV_0007 = '[IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive.',
  IV_0008 = '[IV-0008] Incorrect value for "offset". Set the value to an integer greater than or equal to 0.',
  IV_0009 = '[IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive.',
  IV_0012 = '[IV-0012] Incorrect value for latitude. Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive.',
  IV_0013 = '[IV-0013] Incorrect value for longitude. Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.',
  IV_0014 = '[IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.',
  IV_0015 = '[IV-0015] Incorrect value for "currency". Format the value according to ISO 4217.',
  IV_0016 = '[IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.',
  IV_0017 = '[IV-0017] Incorrect value for "max" in "facet.types". Set the value to an integer between 1 and 100 inclusive.',
  IV_0018 = '[IV-0018] Incorrect value for "keyphrase" in "facet.types". Set the value to a string between 1 and 100 inclusive.',
  IV_0019 = '[IV-0019] Incorrect value for "minCount" in "facet.types". Set the value to an integer between 1 and 100 inclusive.',
  IV_0020 = '[IV-0020] Incorrect value for "after" in "facet.types". Set the value to a non-empty string, and do not include spaces.',
  IV_0021 = '[IV-0021] You must set ​"sort.name"​​ to ​"text"​​ if you use "​after"​​. ',
  MV_0005 = '[MV-0005] "userId" is required.',
  MV_0006 = '[MV-0006] Incorrect value for "country". Format the value according to ISO 3166-1 alpha-2.',
  MV_0007 = '[MV-0007] Incorrect value for "language". Format the value according to ISO 639.',
  MV_0008 = '[MV-0008] if one of the "custom" and "uri" is set and valid then the other one should not be empty.',
  MV_0009 = '[MV-0009] if one of the "groupId" and "id" is set then the other one should not be empty.',
  MV_0010 = '[MV-0010] "entity" is required',
  MV_0011 = '[MV-0011] "rfkId" is required',
  MV_0012 = '[MV-0012] "widgetItems" array should not be empty'
}
/* eslint-enable max-len */
