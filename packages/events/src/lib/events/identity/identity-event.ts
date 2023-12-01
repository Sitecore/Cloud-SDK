// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseEvent } from '../base-event';
import { ExtensionData, EventAttributesInput } from '../common-interfaces';
import { EventApiClient } from '../../ep/EventApiClient';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import { isShortISODateString, isValidEmail, FlattenedObject, flattenObject } from '@sitecore-cloudsdk/utils';
import { EPResponse, Infer, Settings } from '@sitecore-cloudsdk/core';

export class IdentityEvent extends BaseEvent {
  private eventData: IdentityEventAttributesInput;
  private eventApiClient: EventApiClient;
  private extensionData: FlattenedObject = {};
  private numberOfExtensionDataProperties = 0;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param args - Unified object containing the required properties
   */
  constructor(args: IdentityEventArguments) {
    const { channel, currency, language, page } = args.eventData;

    super({ channel, currency, language, page }, args.settings, args.id);

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
  private validateAttributes(eventData: IdentityEventAttributesInput) {
    if (eventData.identifiers.length === 0) throw new Error(`[MV-0003] "identifiers" is required.`);

    if (eventData.dob !== undefined && !isShortISODateString(eventData.dob))
      throw new Error(`[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.`);

    eventData.identifiers.forEach((identifier: Identifier) => {
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
  private mapAttributes(): IdentityEventPayload {
    const identityPayload: IdentityEventPayload = {
      city: this.eventData.city,
      country: this.eventData.country,
      dob: this.eventData.dob,
      email: this.eventData.email,
      firstname: this.eventData.firstName,
      gender: this.eventData.gender,
      identifiers: this.eventData.identifiers.map((value: Identifier): EPIdentifier => {
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
   * Sends the event to Sitecore EP
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();
    const fetchBody = Object.assign({}, eventAttrs, baseAttr);

    return await this.eventApiClient.send(fetchBody);
  }
}

/**
 * The JSON array of objects that contain the identity identifiers
 */
interface EPIdentifier {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  expiry_date?: string;
  id: string;
  provider: string;
}

/**
 * Interface with the necessary attributes for the input for sending Identity events
 */
export interface IdentityEventAttributesInput extends EventAttributesInput {
  city?: string;
  country?: string;
  dob?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  identifiers: Identifier[];
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
export interface Identifier {
  expiryDate?: string;
  id: string;
  provider: string;
}

/**
 *  An interface describing the identity event specific payload to be sent to the API
 */
export interface IdentityEventPayload {
  city?: string;
  country?: string;
  dob?: string;
  email?: string;
  firstname?: string;
  gender?: string;
  identifiers: EPIdentifier[];
  lastname?: string;
  mobile?: string;
  phone?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code?: string;
  state?: string;
  street?: string[];
  title?: string;
  type: 'IDENTITY';
  ext?: FlattenedObject;
}

/**
 * Interface of the unified arguments object for identity event
 */
export interface IdentityEventArguments {
  eventApiClient: EventApiClient;
  eventData: IdentityEventAttributesInput;
  extensionData?: ExtensionData;
  id: string;
  settings: Settings;
  infer?: Infer;
}
