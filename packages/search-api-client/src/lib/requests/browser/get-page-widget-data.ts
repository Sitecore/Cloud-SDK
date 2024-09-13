// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import { Context } from '../../request-entities/context/context';
import { PACKAGE_NAME } from '../../consts';
import type { Pathname } from '../../types';
import type { SearchEndpointResponse } from '../post-request';
import { getSettings } from '../../init/browser/initializer';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data for a page.
 * @param pathname - The path of the URL.
 * @returns The response object.
 */
export async function getPageWidgetData(pathname: Pathname): Promise<SearchEndpointResponse | null> {
  const settings = getEnabledPackage(PACKAGE_NAME)?.initState ? getCloudSDKSettings() : getSettings();
  const context = new Context({ page: { uri: pathname } });
  const contextRequestBody = context.toDTO();
  const body = JSON.stringify({ ...contextRequestBody });

  return await sendPostRequest(body, settings);
}
