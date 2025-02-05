// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { BaseFilter } from './base-filter';
import type { LogicalFilterValues, PickLogicalDTO } from './interfaces';

/**
 * Creates a LogicalFilter object which denotes the base of each filter.
 */
export class LogicalFilter<T extends keyof LogicalFilterValues> extends BaseFilter {
  /**
   * @param operator - The operator to be applied on attribute.
   * @param value - The {@link LogicalFilterValues} to check against.
   * Using "and" or the "or" filter, you must include minimum 2 filters.
   */
  constructor(operator: T, value: LogicalFilterValues[T]) {
    super(operator, value);
  }

  /**
   * @returns The DTO representation of the filter {@link PickLogicalDTO}.
   */
  toDTO(): PickLogicalDTO<T> {
    if (this.operator === 'not')
      return {
        filter: (this.value as BaseFilter).toDTO(),
        type: this.operator
      } as PickLogicalDTO<T>;

    return {
      filters: (this.value as Array<BaseFilter>).map((filter) => filter.toDTO()),
      type: this.operator
    } as PickLogicalDTO<T>;
  }
}
