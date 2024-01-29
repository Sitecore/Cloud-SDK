// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseEvent } from '../base-event';
import { EventAttributesInput } from '../common-interfaces';
import { SendEvent } from '../send-event/sendEvent';
import { EPResponse, Settings } from '@sitecore-cloudsdk/core';
import { BasicTypes, FlattenedObject, NestedObject, flattenObject } from '@sitecore-cloudsdk/utils';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import { ErrorMessages } from '../../consts';

export class CustomEvent extends BaseEvent {
  customEventPayload: CustomEventPayload;
  private sendEvent: SendEvent;
  private extensionData: FlattenedObject = {};
  private settings: Settings;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: CustomEventArguments) {
    const { channel, currency, language, page, ...rest } = args.eventData;
    super({ channel, currency, language, page }, args.id);

    this.sendEvent = args.sendEvent;
    this.settings = args.settings;

    this.customEventPayload = {
      type: args.type,
      ...rest,
    };

    if (args.extensionData) this.extensionData = flattenObject({ object: args.extensionData });

    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES) throw new Error(ErrorMessages.IV_0005);

    if (numberOfExtensionDataProperties > 0) this.customEventPayload.ext = this.extensionData;
  }

  /**
   * Sends the event to Sitecore EP
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const fetchBody = Object.assign({}, this.customEventPayload, baseAttr);

    return await this.sendEvent(fetchBody, this.settings);
  }
}

/**
 * Interface of the unified arguments object for custom event
 */
export interface CustomEventArguments {
  sendEvent: SendEvent;
  eventData: CustomEventData;
  id: string;
  extensionData?: NestedObject;
  settings: Settings;
  type: string;
}

/**
 * Interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
export interface CustomEventPayload extends NestedObject {
  ext?: {
    [key: string]: BasicTypes;
  };
}

/**
 * Interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
export interface CustomEventInput extends EventAttributesInput, NestedObject {}

/**
 * Internal interface with the required/optional attributes in order to send a custom event to SitecoreCloud API
 */
interface CustomEventData extends Partial<EventAttributesInput>, NestedObject {}
