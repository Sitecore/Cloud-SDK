// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import {
  COOKIE_NAME_PREFIX,
  debug,
  enabledPackagesBrowser as enabledPackages,
  type EPResponse,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser,
  type PackageContextDependencyBrowser,
  PackageInitializer
} from '@sitecore-cloudsdk/core/internal';
import {
  addToEventQueue,
  clearEventQueue,
  event,
  PACKAGE_NAME as EVENTS_PACKAGE_NAME,
  form,
  identity,
  PACKAGE_INITIALIZER_METHOD_NAME,
  pageView,
  processEventQueue
} from '@sitecore-cloudsdk/events/browser';
import type { EventData, IdentityData } from '@sitecore-cloudsdk/events/browser';
import { appendScriptWithAttributes } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import { getCdnUrl } from '../../web-personalization/get-cdn-url';
import { createPersonalizeCookie } from './createPersonalizeCookie';
import type { BrowserSettings, PersonalizeSettings, WebPersonalizationSettings } from './interfaces';

export async function sideEffects() {
  const personalizeSettings = getEnabledPackageBrowser(PACKAGE_NAME)?.settings as PersonalizeSettings;
  const cloudSDKSettings = getCloudSDKSettings();

  window.scCloudSDK = {
    ...window.scCloudSDK,
    personalize: {
      version: PACKAGE_VERSION
    }
  };

  if (personalizeSettings.webPersonalization) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.scCloudSDK.personalize.settings = personalizeSettings.webPersonalization;
    window.scCloudSDK.personalize = {
      ...window.scCloudSDK.personalize,
      addToEventQueue,
      clearEventQueue,
      event,
      form,
      identity,
      pageView,
      processEventQueue
    };

    const cdnUrl = await getCdnUrl(cloudSDKSettings.sitecoreEdgeContextId, cloudSDKSettings.sitecoreEdgeUrl);
    if (cdnUrl) appendScriptWithAttributes({ async: personalizeSettings.webPersonalization.async, src: cdnUrl });
  }
  debug(PERSONALIZE_NAMESPACE)('personalizeClient library initialized');

  if (!cloudSDKSettings.cookieSettings.enableBrowserCookie || !personalizeSettings.enablePersonalizeCookie) return;
  await createPersonalizeCookie(personalizeSettings, cloudSDKSettings);
}

/**
 * Makes the functionality of the personalize package available.
 *
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 */
export function addPersonalize(
  this: CloudSDKBrowserInitializer,
  settings: BrowserSettings = { enablePersonalizeCookie: false }
): CloudSDKBrowserInitializer {
  const dependencies: PackageContextDependencyBrowser[] = [];

  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${getCloudSDKSettings().sitecoreEdgeContextId}_personalize`
    }
  };

  let webPersonalization: boolean | WebPersonalizationSettings = false;

  if (settings.webPersonalization) {
    dependencies.push({ method: PACKAGE_INITIALIZER_METHOD_NAME, name: EVENTS_PACKAGE_NAME });

    webPersonalization = {
      async: (settings.webPersonalization as WebPersonalizationSettings).async ?? true,
      defer: (settings.webPersonalization as WebPersonalizationSettings).defer ?? false
    };
  }

  const personalizeInitializer = new PackageInitializer({
    dependencies,
    settings: { ...settings, cookieSettings, webPersonalization },
    sideEffects
  });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-cloudsdk/core/browser' {
  interface CloudSDKBrowserInitializer {
    addPersonalize: typeof addPersonalize;
  }
}

/* eslint-disable @typescript-eslint/naming-convention*/
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Personalize {
    settings?: {
      async?: boolean;
      defer?: boolean;
    };
    version: string;
    pageView?: () => Promise<EPResponse | null>;
    identity?: (identityData: IdentityData) => Promise<EPResponse | null>;
    form?: (formId: string, interactionType: 'VIEWED' | 'SUBMITTED') => Promise<EPResponse | null>;
    event?: (eventData: EventData) => Promise<EPResponse | null>;
    addToEventQueue?: (eventData: EventData) => Promise<void>;
    processEventQueue?: () => Promise<void>;
    clearEventQueue?: () => Promise<void>;
  }
}
