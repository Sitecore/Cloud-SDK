// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPCallFlowsBody, FailedCalledFlowsResponse } from './send-call-flows-request';
import { ErrorMessages, UTM_PREFIX } from '../consts';
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import type { Settings } from '@sitecore-cloudsdk/core';
import { language } from '@sitecore-cloudsdk/core';
import { sendCallFlowsRequest } from './send-call-flows-request';

export class Personalizer {
  /**
   * The Personalizer Class runs a flow of interactive experiments.
   * @param browserId - The browser id of the user
   * @param guestId - The guestRef of the user
   */
  constructor(private browserId: string, private guestId: string) {}

  /**
   * A function to make a request to the Sitecore EP /callFlows API endpoint
   * @param personalizeData - The personalize input from the developer
   * @param settings - The setting that was set during initialization
   * @param opts - Optional object that contains options for timeout and UA
   * @returns - A promise that resolves with either the Sitecore EP response object or null
   */
  async getInteractiveExperienceData(
    personalizeData: PersonalizeData,
    settings: Settings,
    searchParams: string,
    opts?: { timeout?: number; userAgent?: string | null }
  ): Promise<unknown | null | FailedCalledFlowsResponse> {
    this.validate(personalizeData);

    const sanitizedInput = this.sanitizeInput(personalizeData);

    if (searchParams.includes(UTM_PREFIX) && !sanitizedInput.params?.utm) {
      sanitizedInput.params = sanitizedInput.params || {};
      sanitizedInput.params.utm = this.extractUrlParamsWithPrefix(searchParams, UTM_PREFIX);
    }

    const mappedData = this.mapPersonalizeInputToEPData(sanitizedInput);
    if (!mappedData.email && !mappedData.identifiers) mappedData.browserId = this.browserId;

    return await sendCallFlowsRequest(mappedData, settings, opts);
  }

  /**
   * A function that sanitizes the personalize input data
   * @returns - The sanitized object
   */
  private sanitizeInput(personalizeData: PersonalizeData) {
    const sanitizedData: PersonalizeData = {
      channel: personalizeData.channel,
      currency: personalizeData.currency,
      friendlyId: personalizeData.friendlyId,
      language: personalizeData.language
    };

    if (personalizeData.identifier && personalizeData.identifier.id && personalizeData.identifier.id.trim().length > 0)
      sanitizedData.identifier = personalizeData.identifier;

    if (personalizeData.email && personalizeData.email.trim().length > 0) sanitizedData.email = personalizeData.email;

    if (personalizeData.params && Object.keys(personalizeData.params).length > 0)
      sanitizedData.params = personalizeData.params;

    if (personalizeData.geo && Object.keys(personalizeData.geo).length > 0)
      sanitizedData.params = { ...personalizeData.params, geo: { ...personalizeData.geo } };

    if (personalizeData.pageVariantIds?.length) sanitizedData.pageVariantIds = personalizeData.pageVariantIds;

    return sanitizedData;
  }
  /**
   * A function that maps the personalize input data with the EP
   * @returns - The EP object
   */
  private mapPersonalizeInputToEPData(input: PersonalizeData): EPCallFlowsBody {
    const mappedData: EPCallFlowsBody = {
      channel: input.channel,
      clientKey: '',
      currencyCode: input.currency,
      email: input.email,
      friendlyId: input.friendlyId,
      guestRef: this.guestId,
      identifiers: input.identifier,
      language: input.language ?? language(),
      params: input.params,
      pointOfSale: '',
      variants: input.pageVariantIds
    };

    return mappedData;
  }

  /**
   * A validation method to throw error for the mandatory property for runtime users
   */
  private validate({ friendlyId }: PersonalizeData) {
    if (!friendlyId || friendlyId.trim().length === 0) throw new Error(ErrorMessages.MV_0004);
  }

  /**
   * Retrieves UTM parameters from the url query string e.g. `utm_test1=123&utm_test2=456`
   * @param urlParams - The url params passed
   * @param prefix - The prefix we want to extract from the params
   * @returns - an object containing the UTM parameters (if they exist) in the form: `utm: {test1: 123, test2: 456}`
   */
  private extractUrlParamsWithPrefix(urlParams: string, prefix: string): { [key: string]: string } {
    const urlSearchParams = new URLSearchParams(decodeURI(urlParams));
    const extractedParams: { [key: string]: string } = {};

    urlSearchParams.forEach((value: string, key: string) => {
      const paramKey = key.toLowerCase();

      if (paramKey.indexOf(prefix) === 0) {
        const paramName = paramKey.substring(prefix.length);
        extractedParams[paramName] = value;
      }
    });

    return extractedParams;
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
export interface PersonalizeData {
  channel: string;
  currency: string;
  email?: string;
  friendlyId: string;
  geo?: PersonalizeGeolocation;
  identifier?: PersonalizeIdentifierInput;
  language?: string;
  params?: PersonalizeInputParams;
  pageVariantIds?: string[];
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
