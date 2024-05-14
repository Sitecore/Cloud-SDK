// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ComparisonFilterDTO, ComparisonOperators } from './interfaces';
import { BaseFilter } from './base-filter';

/**
 * Creates ComparisonFilter object which denotes the base of each filter.
 */
export class ComparisonFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param operator - The operator to be applied on attribute.
   * @param value - The value to check against of.
   */
  constructor(attributeName: string, operator: ComparisonOperators, value: unknown) {
    super(operator, value);

    this._attributeName = attributeName;
  }

  /**
   * @returns The DTO representation of the filter.
   */
  toDTO(): ComparisonFilterDTO {
    return {
      name: this._attributeName,
      type: this.operator,
      value: this.value
    };
  }
}
