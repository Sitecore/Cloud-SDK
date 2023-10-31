// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { BasicTypes, INestedObject } from '@sitecore-cloudsdk/utils';

/**
 * Event data received as input to be sent to Sitecore CDP
 */
interface IMandatoryInput {
  channel: string;
  currency: string;
}

type IMandatoryEventInput = IMandatoryInput;

/**
 * Event data that is sent to Sitecore CDP
 */
interface IInferrableInput {
  /**
   * To be restored back to IMandatoryEventInput Interface
   * as mandatory input parameter in version 1.0.0
   */
  pointOfSale?: string;
  language?: string;
  page?: string;
}

type IInferrableEventInput = IInferrableInput;

/**
 * Interface to hold the base event attributes
 */
export interface IEventAttributesInput extends IMandatoryEventInput, IInferrableEventInput {}

/**
 * Interface to hold the "ext" data
 */
export interface IExtensionData {
  pageVariantId?: string;
  [key: string]: BasicTypes;
}

/**
 * Type of the extension data that the developer can pass to events
 */
export type ExtensionData = INestedObject;
