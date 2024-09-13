// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsServer as getCloudSDKSettings,
  getEnabledPackageServer as getEnabledPackage
} from '@sitecore-cloudsdk/core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-cloudsdk/core/server';
import { PACKAGE_NAME } from '../../consts';
import type { SearchEndpointResponse } from '../post-request';
import type { ServerSettings } from '../../types';
import type { WidgetRequestData } from '../../request-entities/widgets/widget-request-data';
import { getSettings } from '../../init/server/initializer';
import { sendPostRequest } from '../post-request';
/**
 * This function requests widget data from server side.
 * @param widgetRequestData - An instance of {@link WidgetRequestData}.
 * @returns The response object.
 */
export async function getWidgetDataServer(
  widgetRequestData: WidgetRequestData
): Promise<SearchEndpointResponse | null> {
  let settings: ServerSettings | CloudSDKSettings;

  if (getEnabledPackage(PACKAGE_NAME)) settings = getCloudSDKSettings();
  else settings = getSettings();

  const body = JSON.stringify(widgetRequestData.toDTO());

  return await sendPostRequest(body, settings);
}
