// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCloudSDKSettingsServer as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';
import type { Context } from '../../request-entities/context/context';
import type { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import type { SearchEndpointResponse } from '../post-request';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data from server side.
 * @param widgetRequestData - An instance of {@link WidgetRequestData}.
 * @returns The response object promise: {@link SearchEndpointResponse} | null.
 */
export async function getWidgetDataServer(
  widgetRequestData: WidgetRequestData,
  contextRequestData?: Context
): Promise<SearchEndpointResponse | null> {
  verifySearchPackageExistence();

  const settings = getCloudSDKSettings();
  const widgetRequestBody = widgetRequestData.toDTO();
  const contextRequestBody = contextRequestData?.toDTO();
  const body = JSON.stringify({ ...contextRequestBody, ...widgetRequestBody });

  return await sendPostRequest(body, settings);
}
