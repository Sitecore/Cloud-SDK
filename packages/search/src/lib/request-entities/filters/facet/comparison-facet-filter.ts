// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ComparisonOperators } from '../interfaces';
import type { ComparisonFacetFilterDTO, FacetFilterBase } from './interfaces';

/**
 * Creates ComparisonFacetFilter object.
 */
export class ComparisonFacetFilter implements FacetFilterBase {
  private _operator: ComparisonOperators;
  private _value: string;

  /**
   * @param operator - The {@link ComparisonOperators} to be applied on attribute.
   * @param value - The value to check against of.
   */
  constructor(operator: ComparisonOperators, value: string) {
    this._operator = operator;
    this._value = value;
  }

  /**
   * @returns The DTO representation of the filter {@link ComparisonFacetFilterDTO}.
   */
  toDTO(): ComparisonFacetFilterDTO {
    return {
      type: this._operator,
      value: this._value
    };
  }
}
