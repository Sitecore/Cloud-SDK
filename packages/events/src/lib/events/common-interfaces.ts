// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { NestedObject } from '@sitecore-cloudsdk/utils';

/**
 * Event data received as input to be sent to Sitecore EP
 */
interface MandatoryInput {
  channel: string;
  currency: string;
}

type MandatoryEventInput = MandatoryInput;

/**
 * Event data that is sent to Sitecore EP
 */
interface InferrableInput {
  /**
   * To be restored back to MandatoryEventInput Interface
   * as mandatory input parameter in version 1.0.0
   */
  language?: string;
  page?: string;
}

type InferrableEventInput = InferrableInput;

/**
 * Interface to hold the base event attributes
 */
export interface EventAttributesInput extends MandatoryEventInput, InferrableEventInput {}

/**
 * Type of the extension data that the developer can pass to events
 */
export type ExtensionData = NestedObject;
