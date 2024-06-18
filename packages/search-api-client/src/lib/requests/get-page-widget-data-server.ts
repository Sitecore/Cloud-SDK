// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { Context } from '../request-entities/context/context';
import type { Pathname } from '../types';
import type { SearchEndpointResponse } from './post-request';
import { getSettings } from '../initializer/server/initializer';
import { sendPostRequest } from './post-request';

/**
 * This function requests widget data for a page from server side.
 * @param pathname - The path of the URL.
 * @returns The response object.
 */
export async function getPageWidgetDataServer(pathname: Pathname): Promise<SearchEndpointResponse | null> {
  const settings = getSettings();
  const context = new Context({ page: { uri: pathname } });
  const contextRequestBody = context.toDTO();
  const body = JSON.stringify({ ...contextRequestBody });

  return await sendPostRequest(body, settings);
}
