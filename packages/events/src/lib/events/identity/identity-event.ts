// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { EPResponse, Infer, Settings } from '@sitecore-cloudsdk/core';
import { EventAttributesInput, ExtensionData } from '../common-interfaces';
import { FlattenedObject, flattenObject, isShortISODateString, isValidEmail } from '@sitecore-cloudsdk/utils';
import { BaseEvent } from '../base-event';
import { ErrorMessages } from '../../consts';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import { SendEvent } from '../send-event/sendEvent';

export class IdentityEvent extends BaseEvent {
  private identityData: IdentityData;
  private sendEvent: SendEvent;
  private extensionData: FlattenedObject = {};
  private numberOfExtensionDataProperties = 0;
  private settings: Settings;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   *
   * @param args - Unified object containing the required properties
   */
  constructor(args: IdentityEventArguments) {
    const { channel, currency, language, page, extensionData } = args.identityData;

    super({ channel, currency, language, page }, args.id);

    this.validateAttributes(args.identityData);

    this.identityData = args.identityData;
    this.sendEvent = args.sendEvent;
    this.settings = args.settings;

    if (extensionData) this.extensionData = flattenObject({ object: extensionData });

    this.numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (this.numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES) throw new Error(ErrorMessages.IV_0005);
  }

  /**
   * Function that validates the identifiers object, email and date attributes for CDN users
   *  * @param identityData - The data to be validated
   */
  private validateAttributes(identityData: IdentityData) {
    if (identityData.identifiers.length === 0) throw new Error(ErrorMessages.MV_0003);

    if (identityData.dob !== undefined && !isShortISODateString(identityData.dob))
      throw new Error(ErrorMessages.IV_0002);

    identityData.identifiers.forEach((identifier: Identifier) => {
      if (identifier.expiryDate && !isShortISODateString(identifier.expiryDate)) throw new Error(ErrorMessages.IV_0004);
    });

    if (identityData.email && !isValidEmail(identityData.email)) throw new Error(ErrorMessages.IV_0003);
  }

  /**
   * A function that maps the identity event input data with the payload sent to the API
   * @returns - The payload object
   */
  private mapAttributes(): IdentityEventPayload {
    const identityPayload: IdentityEventPayload = {
      city: this.identityData.city,
      country: this.identityData.country,
      dob: this.identityData.dob,
      email: this.identityData.email,
      firstname: this.identityData.firstName,
      gender: this.identityData.gender,
      identifiers: this.identityData.identifiers.map((value: Identifier): EPIdentifier => {
        return {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          expiry_date: value.expiryDate,
          id: value.id,
          provider: value.provider
        };
      }),
      lastname: this.identityData.lastName,
      mobile: this.identityData.mobile,
      phone: this.identityData.phone,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code: this.identityData.postalCode,
      state: this.identityData.state,
      street: this.identityData.street,
      title: this.identityData.title,
      type: 'IDENTITY'
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

    return await this.sendEvent(fetchBody, this.settings);
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
export interface IdentityData extends EventAttributesInput {
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
  extensionData?: ExtensionData;
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
  sendEvent: SendEvent;
  identityData: IdentityData;
  id: string;
  settings: Settings;
  infer?: Infer;
}
