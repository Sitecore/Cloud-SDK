// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { language } from '@sitecore-cloudsdk/engage-core';
import { ICdpCallFlowsBody, IFailedCalledFlowsResponse, IPersonalizeClient } from './callflow-edge-proxy-client';
import { INestedObject, flattenObject } from '@sitecore-cloudsdk/engage-utils';

export class Personalizer {
  /**
   * The Personalizer Class runs a flow of interactive experiments.
   * @param personalizeClient - The data to be send to Sitecore CDP
   * @param infer - The source of methods to estimate language and page parameters
   */

  constructor(private personalizeClient: IPersonalizeClient, private id: string) {}

  /**
   * A function to make a request to the Sitecore CDP /callFlows API endpoint
   * @param timeout - Optional timeout in milliseconds to cancel the request
   * @returns - A promise that resolves with either the Sitecore CDP response object or null
   */
  async getInteractiveExperienceData(
    personalizeInput: IPersonalizerInput,
    timeout?: number
  ): Promise<unknown | null | IFailedCalledFlowsResponse> {
    this.validate(personalizeInput);

    const sanitizedInput = this.sanitizeInput(personalizeInput);

    const mappedData = this.mapPersonalizeInputToCDPData(sanitizedInput);
    if (!mappedData.email && !mappedData.identifiers) mappedData.browserId = this.id;

    const response = await this.personalizeClient.sendCallFlowsRequest(mappedData, timeout);

    return response;
  }

  /**
   * A function that sanitizes the personalize input data
   * @returns - The sanitized object
   */
  private sanitizeInput(personalizerInput: IPersonalizerInput) {
    const sanitizedInput: IPersonalizerInput = {
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
      sanitizedInput.params = flattenObject({ object: personalizerInput.params });

    return sanitizedInput;
  }
  /**
   * A function that maps the personalize input data with the CDP
   * @returns - The CDP object
   */
  private mapPersonalizeInputToCDPData(input: IPersonalizerInput): ICdpCallFlowsBody {
    const mappedData: ICdpCallFlowsBody = {
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
  private validate({ friendlyId }: IPersonalizerInput) {
    if (!friendlyId || friendlyId.trim().length === 0) throw new Error(`[MV-0008] "friendlyId" is required.`);
  }
}

/**
 * An interface that describes the flow execution model attributes input for the library
 */
export interface IPersonalizerInput {
  channel: string;
  currency: string;
  email?: string;
  friendlyId: string;
  identifier?: IPersonalizeIdentifierInput;
  language?: string;
  params?: IPersonalizeInputParams;
}

/**
 * An interface that describes the identifier model attributes for the library
 */
export interface IPersonalizeIdentifierInput {
  id: string;
  provider: string;
}

/**
 * A type that describes the params field
 */
export type IPersonalizeInputParams = INestedObject;
