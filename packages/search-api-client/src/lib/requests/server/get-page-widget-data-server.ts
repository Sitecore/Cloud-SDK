// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Pathname, ServerSettings } from '../../types';
import {
  getCloudSDKSettingsServer as getCloudSDKSettings,
  getEnabledPackageServer as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import { Context } from '../../request-entities/context/context';
import { PACKAGE_NAME } from '../../consts';
import type { SearchEndpointResponse } from '../post-request';
import { getSettings } from '../../init/server/initializer';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data for a page from server side.
 * @param pathname - The path of the URL.
 * @returns The response object.
 */
export async function getPageWidgetDataServer(pathname: Pathname): Promise<SearchEndpointResponse | null> {
  let settings: ServerSettings | CloudSDKSettings;

  if (getEnabledPackage(PACKAGE_NAME)) settings = getCloudSDKSettings();
  else settings = getSettings();

  const context = new Context({ page: { uri: pathname } });
  const contextRequestBody = context.toDTO();
  const body = JSON.stringify({ ...contextRequestBody });

  return await sendPostRequest(body, settings);
}
