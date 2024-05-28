// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Context } from '../request-entities/context/context';
import type { SearchEndpointResponse } from './post-request';
import type { WidgetRequestData } from '../request-entities/widgets/widget-request-data';
import { getSettings } from '../initializer/browser/initializer';
import { sendPostRequest } from './post-request';

/**
 * This function requests widget data.
 * @param widgetRequestData - An instance of {@link WidgetRequestData}.
 * @returns The response object.
 */
export async function getWidgetData(
  widgetRequestData: WidgetRequestData,
  contextRequestData?: Context
): Promise<SearchEndpointResponse | null> {
  const settings = getSettings();

  const widgetRequestBody = widgetRequestData.toDTO();
  const contextRequestBody = contextRequestData?.toDTO();
  const body = JSON.stringify({ ...contextRequestBody, ...widgetRequestBody });

  return await sendPostRequest(body, settings);
}
