// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { IInfer, ISettings } from '@sitecore-cloudsdk/engage-core';
import { IEventAttributesInput } from './common-interfaces';

export class BaseEvent {
  private readonly browserId: string;
  private readonly language: string | undefined;
  private readonly page: string;
  /**
   * The base event class that has all the shared functions between Events
   * @param baseEventData - The event data to send
   * @param settings - The global settings
   * @param id - The browser id
   * @param infer - The source of methods to estimate language and page parameters
   */
  constructor(
    private baseEventData: IBaseEventData,
    protected settings: ISettings,
    id: string,
    private infer?: IInfer
  ) {
    this.browserId = id;
    this.language = this.baseEventData.language ?? this.infer?.language();
    this.page = this.baseEventData.page ?? (this.infer ? this.infer.pageName() : '');
  }

  /**
   *  A function that returns the properties for sending events to Sitecore CDP
   * @returns an object that is required
   */
  protected mapBaseEventPayload(): IBasePayload {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      browser_id: this.browserId,
      channel: this.baseEventData.channel,
      /* eslint-disable @typescript-eslint/naming-convention */
      client_key: '',
      currency: this.baseEventData.currency,
      language: this.language,
      page: this.page,
      pos: '',
    };
  }
}

/**
 *  An interface describing the basic payload to be sent to the API
 */
export interface IBasePayload {
  browser_id: string;
  channel?: string;
  client_key: string;
  currency?: string;
  language?: string;
  page?: string;
  pos: string;
}

type IBaseEventData = Partial<IEventAttributesInput>;
