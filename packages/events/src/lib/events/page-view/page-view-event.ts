// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ICdpResponse, IInfer, ISettings } from '@sitecore-cloudsdk/core';
import { IFlattenedObject, INestedObject, flattenObject } from '@sitecore-cloudsdk/utils';
import { BaseEvent } from '../base-event';
import { IEventApiClient } from '../../cdp/EventApiClient';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import { IEventAttributesInput } from '../common-interfaces';

export class PageViewEvent extends BaseEvent {
  static isFirstPageView = true;
  private eventApiClient: IEventApiClient;
  private eventData: IPageViewEventInput;
  private extensionData: IFlattenedObject = {};
  private urlSearchParams: URLSearchParams;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: IPageViewEventArguments) {
    const { channel, currency, pointOfSale, language, page } = args.eventData;
    super(
      {
        channel,
        currency,
        language,
        page,
        pointOfSale,
      },
      args.settings,
      args.id
    );

    this.eventData = args.eventData;

    this.urlSearchParams = new URLSearchParams(decodeURI(args.searchParams));
    if (args.extensionData) this.extensionData = flattenObject({ object: args.extensionData });
    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(
        `[IV-0005] This event supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`
      );
    this.eventApiClient = args.eventApiClient;
  }

  /**
   * Gets the variant ID from the url if not passed by the developer
   * Gets the variant ID from the extension data if not found from the url
   * @returns - variant ID or null
   */
  private getPageVariantId(pageVariantIdFromEventData?: string, pageVariantIdFromExt?: string) {
    if (pageVariantIdFromEventData) return pageVariantIdFromEventData;

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
    if (this.eventData.referrer) return this.eventData.referrer;
    if (typeof window === 'undefined') return null;

    if (!PageViewEvent.isFirstPageView || !document.referrer) return null;

    const { hostname, href } = new URL(document.referrer);

    return window.location.hostname !== hostname ? href : null;
  }

  /**
   * Maps parameters given as input to corresponding attributes send to the API
   * @returns the mapped object to be sent as payload
   */
  private mapAttributes(): IPageViewEventPayload {
    let viewPayload: IPageViewEventPayload = {
      type: 'VIEW',
    };

    const pageVariantId = this.getPageVariantId(
      this.eventData.pageVariantId,
      this.extensionData['pageVariantId'] as string
    );

    if (pageVariantId !== null) viewPayload.ext = { ...viewPayload.ext, pageVariantId };

    if (Object.keys(this.extensionData).length > 0) {
      delete this.extensionData['pageVariantId'];
      viewPayload.ext = { ...viewPayload.ext, ...this.extensionData };
    }

    const referrer = this.getReferrer();

    if (referrer !== null) viewPayload = { ...viewPayload, referrer };

    return viewPayload;
  }

  /**
   * Sends the event to Sitecore CDP
   * @returns - A promise that resolves with either the Sitecore CDP response object or null
   */
  async send(): Promise<ICdpResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();
    const fetchBody = Object.assign({}, eventAttrs, baseAttr);

    PageViewEvent.isFirstPageView = false;
    return await this.eventApiClient.send(fetchBody);
  }
}

/**
 * Interface of the unified arguments object for page view event
 */
export interface IPageViewEventArguments {
  eventApiClient: IEventApiClient;
  eventData: IPageViewEventInput;
  id: string;
  settings: ISettings;
  infer?: IInfer;
  extensionData?: INestedObject;
  searchParams: string;
}

/**
 * Type with the required/optional attributes in order to send a view event to SitecoreCloud API
 */
export interface IPageViewEventInput extends IEventAttributesInput {
  pageVariantId?: string;
  referrer?: string;
}

/**
 * Interface with the utm_ parameters
 */
interface IUtmParameters {
  [key: `utm_${string}`]: string;
}

/**
 * An interface describing the page view event specific payload to be sent * to the API
 */
export interface IPageViewEventPayload extends IUtmParameters {
  type: 'VIEW';
  referrer?: string;
  ext?: { pageVariantId?: string } & IFlattenedObject;
}
