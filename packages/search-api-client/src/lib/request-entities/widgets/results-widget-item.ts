// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { Filter } from '../filters/interfaces';
import type { ContentOptions, ResultsItemDTO, ResultsOptions } from './interfaces';
import { WidgetItem } from './widget-item';

export class ResultsWidgetItem extends WidgetItem {
  protected _limit?: number;
  protected _content?: ContentOptions;
  protected _groupBy?: string;
  protected _filter?: Filter;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param resultOptions - The widget's results options object.
   */
  constructor(entity: string, rfkId: string, resultOptions?: ResultsOptions) {
    super(entity, rfkId);

    this._validateNumberInRange1To100(ErrorMessages.IV_0007, resultOptions?.limit);
    this._validateGroupBy(resultOptions?.groupBy);

    this._limit = resultOptions?.limit;
    this._content = resultOptions?.content;
    this._groupBy = resultOptions?.groupBy;
    this._filter = resultOptions?.filter;
  }

  /**
   * Sets the search limit for the WidgetItem.
   * This method updates the `limit` property of the search configuration within the WidgetItem instance.
   * The limit is used to specify the maximum number of results to be returned, useful for controlling pagination.
   *
   * @param limit - The number to set as the search limit, which must be between 1 and 100, inclusive.
   * @throws Error If the limit is less than 1 or greater than 100, indicating an invalid range.
   */
  set limit(limit: number) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0007, limit);

    this._limit = limit;
  }

  /**
   * Sets the limit to undefined
   */
  resetLimit() {
    this._limit = undefined;
  }

  /**
   * Sets the search content for the ResultsItem.
   * This method updates the `content` property within the ResultsItem instance.
   * The fields is used to define specific search criteria or filters.
   * @param contentOptions - The array fields that specifies the search criteria.
   */
  set content(contentOptions: ContentOptions) {
    this._content = contentOptions;
  }

  /**
   * Sets the content to undefined
   */
  resetContent() {
    this._content = undefined;
  }

  /**
   * Sets the group_by operator for search object of the WidgetItem.
   * This method updates the `attribute` property of the search configuration within the WidgetItem instance.
   * @param groupBy - The attribute that specifies what search results are grouped by.
   */
  set groupBy(groupBy: string) {
    this._validateGroupBy(groupBy);

    this._groupBy = groupBy;
  }

  /**
   * Sets the groupBy to undefined
   */
  resetGroupBy() {
    this._groupBy = undefined;
  }

  private _validateGroupBy(groupBy?: string): void {
    if (typeof groupBy === 'string' && groupBy.trim().length === 0) throw new Error(ErrorMessages.IV_0022);
  }

  /**
   * Set the search filter
   */
  set filter(filter: Filter) {
    this._filter = filter;
  }

  /**
   * Sets the filter to undefined
   */
  resetFilter() {
    this._filter = undefined;
  }

  /**
   * Maps the results item to its DTO format.
   */
  protected _resultsToDTO(): ResultsItemDTO {
    return {
      ...(this._limit && { limit: this._limit }),
      ...(this._filter && { filter: this._filter.toDTO() }),
      ...(this._groupBy && { group_by: this._groupBy }),
      ...(this._content && { content: this._content })
    };
  }
}
