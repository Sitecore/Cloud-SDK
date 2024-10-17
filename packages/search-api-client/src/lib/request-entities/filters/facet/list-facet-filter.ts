// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ArrayOfAtLeastOne, ListOperators } from '../interfaces';
import type { FacetFilterBase, ListFacetFilterDTO } from './interfaces';

/**
 * Creates ListFacetFilter object.
 */
export class ListFacetFilter implements FacetFilterBase {
  private _operator: ListOperators;
  private _values: ArrayOfAtLeastOne<string>;

  /**
   * @param operator - The operator to be applied on attribute.
   * @param values - The values to check against of.
   */
  constructor(operator: ListOperators, values: ArrayOfAtLeastOne<string>) {
    this._operator = operator;
    this._values = values;
  }

  /**
   * @returns The DTO representation of the filter.
   */
  toDTO(): ListFacetFilterDTO {
    return {
      type: this._operator,
      values: this._values
    };
  }
}
