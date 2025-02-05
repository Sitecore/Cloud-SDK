// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCloudSDKSettingsServer as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';
import type { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import type { SearchEndpointResponse } from '../post-request';
import { sendPostRequest } from '../post-request';

/**
 * This function requests widget data from server side.
 * @param widgetRequestData - An instance of {@link WidgetRequestData}.
 * @returns The response object promise: {@link SearchEndpointResponse} | null.
 */
export async function getWidgetDataServer(
  widgetRequestData: WidgetRequestData
): Promise<SearchEndpointResponse | null> {
  verifySearchPackageExistence();

  const settings = getCloudSDKSettings();

  const body = JSON.stringify(widgetRequestData.toDTO());

  return await sendPostRequest(body, settings);
}
