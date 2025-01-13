// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Operators } from './interfaces';

/**
 * Creates BaseFilter object which ComparisonFilter inherits.
 */
export abstract class BaseFilter {
  /**
   * @param operator - The operator to be applied on attribute.
   * @param value - The value to check against of.
   */
  constructor(protected operator: Operators, protected value: unknown) {}

  /**
   * @returns The DTO representation of the filter.
   */
  abstract toDTO(): unknown;
}
