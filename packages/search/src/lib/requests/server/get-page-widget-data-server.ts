// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCloudSDKSettingsServer as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages } from '../../consts';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';
import { Context } from '../../request-entities/context/context';
import type { Pathname } from '../../types';
import type { SearchEndpointResponse } from '../post-request';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data for a page from server side.
 * @param pathname - The {@link Pathname} of the URL.
 * @returns The response object.
 */
export async function getPageWidgetDataServer(pathname: Pathname): Promise<SearchEndpointResponse | null>;
/**
 * This function requests widget data for a page from server side.
 * @param context - The {@link Context}.
 * @returns The response object promise: {@link SearchEndpointResponse} | null.
 */
export async function getPageWidgetDataServer(context: Context): Promise<SearchEndpointResponse | null>;

/**
 * This function requests widget data for a page from server side.
 * @param param - The {@link Context} | {@link Context}
 * @returns The response object promise: {@link SearchEndpointResponse} | null.
 */
export async function getPageWidgetDataServer(param: Pathname | Context): Promise<SearchEndpointResponse | null> {
  verifySearchPackageExistence();

  const settings = getCloudSDKSettings();

  let context: Context;

  if (param instanceof Context) {
    if (!param.page) throw new Error(ErrorMessages.MV_0006);

    context = param;
  } else context = new Context({ page: { uri: param } });

  const contextRequestBody = context.toDTO();
  const body = JSON.stringify({ ...contextRequestBody });

  return await sendPostRequest(body, settings);
}
