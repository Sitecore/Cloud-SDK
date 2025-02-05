// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseFilter } from './base-filter';
import type { ListFilterDTO, ListOperators } from './interfaces';

/**
 * Creates ListFilter object which denotes the base of each filter.
 */
export class ListFilter extends BaseFilter {
  private _attributeName: string;

  /**
   * @param attributeName - The name of the attribute to filter.
   * @param operator - The {@link ListOperators} to be applied on attribute.
   * @param value - The value[] to check against of.
   */
  constructor(attributeName: string, operator: ListOperators, value: unknown[]) {
    super(operator, value);

    this._attributeName = attributeName;
  }

  /**
   * @returns The DTO representation of the filter {@link ListFilterDTO}.
   */
  toDTO(): ListFilterDTO {
    return {
      name: this._attributeName,
      type: this.operator,
      values: this.value as unknown[]
    };
  }
}
