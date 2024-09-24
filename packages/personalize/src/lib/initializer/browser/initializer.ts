// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings, PersonalizeSettings, WebPersonalizationSettings } from './interfaces';
import {
  PACKAGE_NAME as EVENTS_PACKAGE_NAME,
  PACKAGE_INITIALIZER_METHOD_NAME,
  addToEventQueue,
  clearEventQueue,
  event,
  form,
  identity,
  pageView,
  processEventQueue
} from '@sitecore-cloudsdk/events/browser';
import type { EventData, IdentityData } from '@sitecore-cloudsdk/events/browser';
import { PACKAGE_NAME, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import {
  type PackageContextDependencyBrowser,
  PackageInitializer,
  type SideEffectsFn,
  type EPResponse,
  debug,
  enabledPackagesBrowser as enabledPackages,
  getCloudSDKSettingsBrowser as getCloudSDKSettings
} from '@sitecore-cloudsdk/core/internal';
import { CloudSDKBrowserInitializer } from '@sitecore-cloudsdk/core/browser';
import { appendScriptWithAttributes } from '@sitecore-cloudsdk/utils';
import { getCdnUrl } from '../../web-personalization/get-cdn-url';

export async function sideEffects(settings: PersonalizeSettings) {
  window.scCloudSDK = {
    ...window.scCloudSDK,
    personalize: {
      version: PACKAGE_VERSION
    }
  };

  if (settings.webPersonalization) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.scCloudSDK.personalize.settings = settings.webPersonalization;
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

    const cloudSDKSettings = getCloudSDKSettings();
    const cdnUrl = await getCdnUrl(cloudSDKSettings.sitecoreEdgeContextId, cloudSDKSettings.sitecoreEdgeUrl);
    if (cdnUrl) appendScriptWithAttributes({ async: settings.webPersonalization.async, src: cdnUrl });
  }

  debug(PERSONALIZE_NAMESPACE)('personalizeClient library initialized');
}

/**
 * Makes the functionality of the personalize package available.
 *
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 */
export function addPersonalize(
  this: CloudSDKBrowserInitializer,
  settings?: BrowserSettings
): CloudSDKBrowserInitializer {
  const dependencies: PackageContextDependencyBrowser[] = [];

  let webPersonalization: boolean | WebPersonalizationSettings;
  if (!settings?.webPersonalization) webPersonalization = false;
  else {
    dependencies.push({ method: PACKAGE_INITIALIZER_METHOD_NAME, name: EVENTS_PACKAGE_NAME });

    webPersonalization = {
      async: (settings.webPersonalization as WebPersonalizationSettings).async ?? true,
      defer: (settings.webPersonalization as WebPersonalizationSettings).defer ?? false
    };
  }

  const personalizeInitializer = new PackageInitializer({
    dependencies,
    settings: settings ? { ...settings, webPersonalization } : { webPersonalization },
    sideEffects: sideEffects as SideEffectsFn
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
