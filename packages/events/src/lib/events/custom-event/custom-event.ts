// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseEvent } from '../base-event';
import { IEventAttributesInput } from '../common-interfaces';
import { IEventApiClient } from '../../ep/EventApiClient';
import { IEPResponse, ISettings } from '@sitecore-cloudsdk/core';
import { BasicTypes, IFlattenedObject, INestedObject, flattenObject } from '@sitecore-cloudsdk/utils';
import { MAX_EXT_ATTRIBUTES } from '../consts';

export class CustomEvent extends BaseEvent {
  customEventPayload: ICustomEventPayload;
  private eventApiClient: IEventApiClient;
  private extensionData: IFlattenedObject = {};

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: ICustomEventArguments) {
    const { channel, currency, language, page, ...rest } = args.eventData;
    super({ channel, currency, language, page }, args.settings, args.id);

    this.eventApiClient = args.eventApiClient;

    this.customEventPayload = {
      type: args.type,
      ...rest,
    };

    if (args.extensionData) this.extensionData = flattenObject({ object: args.extensionData });

    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(
        `[IV-0005] This event supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`
      );

    if (numberOfExtensionDataProperties > 0) this.customEventPayload.ext = this.extensionData;
  }

  /**
   * Sends the event to Sitecore EP
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async send(): Promise<IEPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const fetchBody = Object.assign({}, this.customEventPayload, baseAttr);

    return await this.eventApiClient.send(fetchBody);
  }
}

/**
 * Interface of the unified arguments object for custom event
 */
export interface ICustomEventArguments {
  eventApiClient: IEventApiClient;
  eventData: ICustomEventData;
  id: string;
  extensionData?: INestedObject;
  settings: ISettings;
  type: string;
}

/**
 * Interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
export interface ICustomEventPayload extends INestedObject {
  ext?: {
    [key: string]: BasicTypes;
  };
}

/**
 * Interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
export interface ICustomEventInput extends IEventAttributesInput, INestedObject {}

/**
 * Internal interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
interface ICustomEventData extends Partial<IEventAttributesInput>, INestedObject {}
