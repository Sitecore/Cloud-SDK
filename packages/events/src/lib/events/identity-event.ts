// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseEvent } from './base-event';
import { ExtensionData, IEventAttributesInput } from './common-interfaces';
import { IEventApiClient } from '../cdp/EventApiClient';
import { MAX_EXT_ATTRIBUTES } from './consts';
import { isShortISODateString, isValidEmail, IFlattenedObject, flattenObject } from '@sitecore-cloudsdk/engage-utils';
import { ICdpResponse, IInfer, ISettings } from '@sitecore-cloudsdk/engage-core';

export class IdentityEvent extends BaseEvent {
  private eventData: IIdentityEventAttributesInput;
  private eventApiClient: IEventApiClient;
  private extensionData: IFlattenedObject = {};
  private numberOfExtensionDataProperties = 0;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: IIdentityEventArguments) {
    const { channel, currency, pointOfSale, language, page } = args.eventData;
    super({ channel, currency, language, page, pointOfSale }, args.settings, args.id, args.infer);

    this.validateAttributes(args.eventData);

    this.eventData = args.eventData;
    this.eventApiClient = args.eventApiClient;

    if (args.extensionData) this.extensionData = flattenObject({ object: args.extensionData });

    this.numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (this.numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(
        `[IV-0005] This event supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`
      );
  }

  /**
   * Function that validates the identifiers object, email and date attributes for CDN users
   *  * @param eventData - The data to be validated
   */
  private validateAttributes(eventData: IIdentityEventAttributesInput) {
    if (eventData.identifiers.length === 0) throw new Error(`[MV-0004] "identifiers" is required.`);

    if (eventData.dob !== undefined && !isShortISODateString(eventData.dob))
      throw new Error(`[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.`);

    eventData.identifiers.forEach((identifier: IIdentifier) => {
      if (identifier.expiryDate && !isShortISODateString(identifier.expiryDate))
        throw new Error(`[IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601.`);
    });

    if (eventData.email && !isValidEmail(eventData.email))
      throw new Error(`[IV-0003] Incorrect value for "email". Set the value to a valid email address.`);
  }

  /**
   * A function that maps the identity event input data with the payload sent to the API
   * @returns - The payload object
   */
  private mapAttributes(): IIdentityEventPayload {
    const identityPayload: IIdentityEventPayload = {
      city: this.eventData.city,
      country: this.eventData.country,
      dob: this.eventData.dob,
      email: this.eventData.email,
      firstname: this.eventData.firstName,
      gender: this.eventData.gender,
      identifiers: this.eventData.identifiers.map((value: IIdentifier): ICDPIdentifier => {
        return {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          expiry_date: value.expiryDate,
          id: value.id,
          provider: value.provider,
        };
      }),
      lastname: this.eventData.lastName,
      mobile: this.eventData.mobile,
      phone: this.eventData.phone,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code: this.eventData.postalCode,
      state: this.eventData.state,
      street: this.eventData.street,
      title: this.eventData.title,
      type: 'IDENTITY',
    };

    if (this.numberOfExtensionDataProperties > 0) identityPayload.ext = this.extensionData;

    return identityPayload;
  }

  /**
   * Sends the event to Sitecore CDP
   * @returns - A promise that resolves with either the Sitecore CDP response object or null
   */
  async send(): Promise<ICdpResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();
    const fetchBody = Object.assign({}, eventAttrs, baseAttr);

    return await this.eventApiClient.send(fetchBody);
  }
}

/**
 * The JSON array of objects that contain the identity identifiers
 */
interface ICDPIdentifier {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  expiry_date?: string;
  id: string;
  provider: string;
}

/**
 * Interface with the necessary attributes for the input for sending Identity events
 */
export interface IIdentityEventAttributesInput extends IEventAttributesInput {
  city?: string;
  country?: string;
  dob?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  identifiers: IIdentifier[];
  lastName?: string;
  mobile?: string;
  phone?: string;
  postalCode?: string;
  state?: string;
  street?: string[];
  title?: string;
}

/**
 * The JSON array of objects that contain the identity identifiers
 */
export interface IIdentifier {
  expiryDate?: string;
  id: string;
  provider: string;
}

/**
 *  An interface describing the identity event specific payload to be sent to the API
 */
export interface IIdentityEventPayload {
  city?: string;
  country?: string;
  dob?: string;
  email?: string;
  firstname?: string;
  gender?: string;
  identifiers: ICDPIdentifier[];
  lastname?: string;
  mobile?: string;
  phone?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code?: string;
  state?: string;
  street?: string[];
  title?: string;
  type: 'IDENTITY';
  ext?: IFlattenedObject;
}

/**
 * Interface of the unified arguments object for identity event
 */
export interface IIdentityEventArguments {
  eventApiClient: IEventApiClient;
  eventData: IIdentityEventAttributesInput;
  extensionData?: ExtensionData;
  id: string;
  settings: ISettings;
  infer?: IInfer;
}
