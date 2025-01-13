// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { FacetFilter } from '../../widgets/interfaces';
import type { LogicalOperators } from '../interfaces';
import type { FacetFilterBase, LogicalFacetFilterDTO } from './interfaces';

/**
 * Creates LogicalFacetFilter object.
 */
export class LogicalFacetFilter implements FacetFilterBase {
  private _operator: Exclude<LogicalOperators, 'not'>;
  private _value: Array<FacetFilter>;

  /**
   * @param operator - The operator to be applied on attribute.
   * @param value - The value to check against of.
   */
  constructor(operator: Exclude<LogicalOperators, 'not'>, value: Array<FacetFilter>) {
    this._operator = operator;
    this._value = value;
  }

  /**
   * @returns The DTO representation of the filter.
   */
  toDTO(): LogicalFacetFilterDTO {
    return {
      filters: this._value.map((filter) => filter.toDTO()),
      type: this._operator
    } as LogicalFacetFilterDTO;
  }
}
