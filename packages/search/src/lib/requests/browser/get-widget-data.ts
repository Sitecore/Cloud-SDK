// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings // getEnabledPackageBrowser as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import { awaitInit } from '../../initializer/browser/initializer';
import type { Context } from '../../request-entities/context/context';
import type { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import type { SearchEndpointResponse } from '../post-request';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data.
 * @param widgetRequestData - An instance of {@link WidgetRequestData}.
 * @param contextRequestData - An instance of {@link Context}.
 * @returns The response object promise: {@link SearchEndpointResponse} | null.
 */
export async function getWidgetData(
  widgetRequestData: WidgetRequestData,
  contextRequestData?: Context
): Promise<SearchEndpointResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();

  const widgetRequestBody = widgetRequestData.toDTO();
  const contextRequestBody = contextRequestData?.toDTO();
  const body = JSON.stringify({ ...contextRequestBody, ...widgetRequestBody });

  return await sendPostRequest(body, settings);
}
