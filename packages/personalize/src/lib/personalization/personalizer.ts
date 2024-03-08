// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { Settings, language, debug } from '@sitecore-cloudsdk/core';
import { sendCallFlowsRequest, EPCallFlowsBody, FailedCalledFlowsResponse } from './send-call-flows-request';
import { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages, PERSONALIZE_NAMESPACE } from '../consts';

export class Personalizer {
  /**
   * The Personalizer Class runs a flow of interactive experiments.
   * @param id - The browser id of the user
   */
  constructor(private id: string) {}

  /**
   * A function to make a request to the Sitecore EP /callFlows API endpoint
   * @param personalizeInput - The personalize input from the developer
   * @param settings - The setting that was set during initialization
   * @param opts - Optional object that contains options for timeout and UA
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async getInteractiveExperienceData(
    personalizeInput: PersonalizerInput,
    settings: Settings,
    opts?: { timeout?: number; userAgent?: string | null }
  ): Promise<unknown | null | FailedCalledFlowsResponse> {
    this.validate(personalizeInput);

    const sanitizedInput = this.sanitizeInput(personalizeInput);

    const mappedData = this.mapPersonalizeInputToEPData(sanitizedInput);
    if (!mappedData.email && !mappedData.identifiers) mappedData.browserId = this.id;

    return sendCallFlowsRequest(mappedData, settings, opts)
      .then((payload) => {
        debug(PERSONALIZE_NAMESPACE)('Personalize payload: %O' as const, payload);
        return payload;
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * A function that sanitizes the personalize input data
   * @returns - The sanitized object
   */
  private sanitizeInput(personalizerInput: PersonalizerInput) {
    const sanitizedInput: PersonalizerInput = {
      channel: personalizerInput.channel,
      currency: personalizerInput.currency,
      friendlyId: personalizerInput.friendlyId,
      language: personalizerInput.language,
    };

    if (
      personalizerInput.identifier &&
      personalizerInput.identifier.id &&
      personalizerInput.identifier.id.trim().length > 0
    )
      sanitizedInput.identifier = personalizerInput.identifier;

    if (personalizerInput.email && personalizerInput.email.trim().length > 0)
      sanitizedInput.email = personalizerInput.email;

    if (personalizerInput.params && Object.keys(personalizerInput.params).length > 0)
      sanitizedInput.params = personalizerInput.params;

    if (personalizerInput.geo && Object.keys(personalizerInput.geo).length > 0)
      sanitizedInput.params = { ...sanitizedInput.params, geo: { ...personalizerInput.geo } };

    return sanitizedInput;
  }
  /**
   * A function that maps the personalize input data with the EP
   * @returns - The EP object
   */
  private mapPersonalizeInputToEPData(input: PersonalizerInput): EPCallFlowsBody {
    const mappedData: EPCallFlowsBody = {
      channel: input.channel,
      clientKey: '',
      currencyCode: input.currency,
      email: input.email,
      friendlyId: input.friendlyId,
      identifiers: input.identifier,
      language: input.language ?? language(),
      params: input.params,
      pointOfSale: '',
    };

    return mappedData;
  }

  /**
   * A validation method to throw error for the mandatory property for runtime users
   */
  private validate({ friendlyId }: PersonalizerInput) {
    if (!friendlyId || friendlyId.trim().length === 0) throw new Error(ErrorMessages.MV_0004);
  }
}

/**
 * An interface that describes the geolocation attributes.
 */
export interface PersonalizeGeolocation {
  city?: string;
  country?: string;
  region?: string;
}

/**
 * An interface that describes the flow execution model attributes input for the library
 */
export interface PersonalizerInput {
  channel: string;
  currency: string;
  email?: string;
  friendlyId: string;
  geo?: PersonalizeGeolocation;
  identifier?: PersonalizeIdentifierInput;
  language?: string;
  params?: PersonalizeInputParams;
}

/**
 * An interface that describes the identifier model attributes for the library
 */
export interface PersonalizeIdentifierInput {
  id: string;
  provider: string;
}

/**
 * A type that describes the params field
 */
export type PersonalizeInputParams = NestedObject;
