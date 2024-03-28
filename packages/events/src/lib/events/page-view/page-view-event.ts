// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EPResponse, Infer, Settings } from '@sitecore-cloudsdk/core';
import { FlattenedObject, NestedObject, flattenObject } from '@sitecore-cloudsdk/utils';
import { BaseEvent } from '../base-event';
import { MAX_EXT_ATTRIBUTES, UTM_PREFIX } from '../consts';
import { EventAttributesInput, ExtensionData } from '../common-interfaces';
import { SendEvent } from '../send-event/sendEvent';
import { ErrorMessages } from '../../consts';

export class PageViewEvent extends BaseEvent {
  static isFirstPageView = true;
  private sendEvent: SendEvent;
  private pageViewData: PageViewData;
  private extensionData: FlattenedObject = {};
  private urlSearchParams: URLSearchParams;
  private includeUTMParameters: boolean;
  settings: Settings;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: PageViewEventArguments) {
    const { channel, currency, language, page, extensionData } = args.pageViewData;
    super(
      {
        channel,
        currency,
        language,
        page,
      },
      args.id
    );

    this.pageViewData = args.pageViewData;
    this.sendEvent = args.sendEvent;
    this.settings = args.settings;
    this.urlSearchParams = new URLSearchParams(decodeURI(args.searchParams));

    if (extensionData) this.extensionData = flattenObject({ object: extensionData });
    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES) throw new Error(ErrorMessages.IV_0005);

    this.includeUTMParameters =
      args.pageViewData.includeUTMParameters === undefined ? true : args.pageViewData.includeUTMParameters;
  }

  /**
   * Gets the variant ID from the url if not passed by the developer
   * Gets the variant ID from the extension data if not found from the url
   * @returns - variant ID or null
   */
  private getPageVariantId(pageVariantIdFromPageViewData?: string, pageVariantIdFromExt?: string) {
    if (pageVariantIdFromPageViewData) return pageVariantIdFromPageViewData;

    const pageVariantIdFromURL = this.urlSearchParams.get('variantid');

    if (pageVariantIdFromURL) return pageVariantIdFromURL;
    if (pageVariantIdFromExt) return pageVariantIdFromExt;

    return null;
  }

  /**
   * Returns the referrer if exists on page view event else null if we are on server and no referrer is on event, else
   * returns the href if on client side and the document referrer is different from the window location hostname
   * @returns - the referrer
   */
  private getReferrer() {
    if (this.pageViewData.referrer) return this.pageViewData.referrer;
    if (typeof window === 'undefined') return null;

    if (!PageViewEvent.isFirstPageView || !document.referrer) return null;

    const { hostname, href } = new URL(document.referrer);

    return window.location.hostname !== hostname ? href : null;
  }

  /**
   * Maps parameters given as input to corresponding attributes send to the API
   * @returns the mapped object to be sent as payload
   */
  private mapAttributes(): PageViewEventPayload {
    let viewPayload: PageViewEventPayload = {
      type: 'VIEW',
    };

    const pageVariantId = this.getPageVariantId(
      this.pageViewData.pageVariantId,
      this.extensionData['pageVariantId'] as string
    );

    if (pageVariantId !== null) viewPayload.ext = { ...viewPayload.ext, pageVariantId };

    if (Object.keys(this.extensionData).length > 0) {
      delete this.extensionData['pageVariantId'];
      viewPayload.ext = { ...viewPayload.ext, ...this.extensionData };
    }

    if (this.includeUTMParameters) {
      const utmParameters = this.getUTMParameters();
      viewPayload = { ...viewPayload, ...utmParameters };
    }

    const referrer = this.getReferrer();

    if (referrer !== null) viewPayload = { ...viewPayload, referrer };

    return viewPayload;
  }

  /**
   * Sends the event to Sitecore EP
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();
    const fetchBody = Object.assign({}, eventAttrs, baseAttr);

    PageViewEvent.isFirstPageView = false;

    return await this.sendEvent(fetchBody, this.settings);
  }

  /**
   * Retrieves UTM parameters from the url query string
   * @returns - an object containing the UTM parameters if they exist
   */
  private getUTMParameters() {
    const utmParameters: UtmParameters = {};

    this.urlSearchParams.forEach((value: string, key: string) => {
      const param = key.toLowerCase();

      if (param.indexOf(UTM_PREFIX) === 0) utmParameters[param as keyof UtmParameters] = value;
    });

    return utmParameters;
  }
}

/**
 * Interface of the unified arguments object for page view event
 */
export interface PageViewEventArguments {
  sendEvent: SendEvent;
  pageViewData: PageViewData;
  id: string;
  settings: Settings;
  infer?: Infer;
  extensionData?: NestedObject;
  searchParams: string;
}

/**
 * Type with the required/optional attributes in order to send a view event to SitecoreCloud API
 */
export interface PageViewData extends EventAttributesInput {
  pageVariantId?: string;
  referrer?: string;
  includeUTMParameters?: boolean;
  extensionData?: ExtensionData;
}

/**
 * Interface with the utm_ parameters
 */
interface UtmParameters {
  [key: `utm_${string}`]: string;
}

/**
 * An interface describing the page view event specific payload to be sent * to the API
 */
export interface PageViewEventPayload extends UtmParameters {
  type: 'VIEW';
  referrer?: string;
  ext?: { pageVariantId?: string } & FlattenedObject;
}
