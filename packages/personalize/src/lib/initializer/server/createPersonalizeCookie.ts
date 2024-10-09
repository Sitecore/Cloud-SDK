// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Settings } from '@sitecore-cloudsdk/core/server';
import {
  isHttpRequest,
  isHttpResponse,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse,
  type Request,
  type Response
} from '@sitecore-cloudsdk/utils';
import { handleHttpCookie } from './handleHttpCookie';
import { handleNextJsMiddlewareCookie } from './handleNextJsMiddlewareCookie';
import type { PersonalizeSettings } from './interfaces';

export async function createPersonalizeCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
) {
  if (isNextJsMiddlewareRequest(request) && isNextJsMiddlewareResponse(response))
    await handleNextJsMiddlewareCookie(request, response, settings, cloudSDKSettings);
  else if (isHttpRequest(request) && isHttpResponse(response))
    await handleHttpCookie(request, response, settings, cloudSDKSettings);
}
