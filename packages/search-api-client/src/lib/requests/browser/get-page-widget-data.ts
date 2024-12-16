// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import { getSettings } from '../../init/browser/initializer';
import { Context } from '../../request-entities/context/context';
import type { Pathname } from '../../types';
import type { SearchEndpointResponse } from '../post-request';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data for a page.
 * @param pathname - The path of the URL.
 * @returns The response object.
 */
export async function getPageWidgetData(pathname: Pathname): Promise<SearchEndpointResponse | null>;
/**
 * This function requests widget data for a page.
 * @param context - The context.
 * @returns The response object.
 */
export async function getPageWidgetData(context: Context): Promise<SearchEndpointResponse | null>;
export async function getPageWidgetData(param: Pathname | Context): Promise<SearchEndpointResponse | null> {
  const settings = getEnabledPackage(PACKAGE_NAME)?.initState ? getCloudSDKSettings() : getSettings();
  let context: Context;

  if (param instanceof Context) {
    if (!param.page) throw new Error(ErrorMessages.MV_0006);

    context = param;
  } else context = new Context({ page: { uri: param } });

  const contextRequestBody = context.toDTO();
  const body = JSON.stringify({ ...contextRequestBody });

  return await sendPostRequest(body, settings);
}
