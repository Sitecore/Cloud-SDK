// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { NestedObject } from '@sitecore-cloudsdk/utils';

/**
 * Event data that is sent to Sitecore EP
 */
export interface EventAttributesInput {
  language?: string;
  page?: string;
  channel?: string;
  currency?: string;
}

/**
 * Type of the extension data that the developer can pass to events
 */
export type ExtensionData = NestedObject;
