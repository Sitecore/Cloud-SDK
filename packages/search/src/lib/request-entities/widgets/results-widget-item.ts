// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { Filter } from '../filters/interfaces';
import type { ContentOptions, ContentOptionsDto, ResultsItemDTO, ResultsOptions } from './interfaces';
import { RuleWidgetItem } from './rule-widget-item';

export class ResultsWidgetItem extends RuleWidgetItem {
  protected _limit?: number;
  protected _content?: ContentOptions;
  protected _groupBy?: string;
  protected _filter?: Filter;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   * @param resultOptions - The widget's {@link ResultsOptions} object.
   * @throws - {@link ErrorMessages.IV_0007} | {@link ErrorMessages.IV_0022}
   */
  constructor(entity: string, widgetId: string, resultOptions?: ResultsOptions) {
    super(entity, widgetId, resultOptions?.rule);

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
   * @returns The limit property of the WidgetItem.
   */
  get limit(): number | undefined {
    return this._limit;
  }

  /**
   * Sets the limit to undefined
   */
  resetLimit(): void {
    this._limit = undefined;
  }

  /**
   * Sets the search content for the ResultsItem.
   * This method updates the `content` property within the ResultsItem instance.
   * The attributes is used to define specific search criteria or filters.
   * @param contentOptions - The array attributes {@link ContentOptions} that specifies the search criteria.
   */
  set content(contentOptions: ContentOptions) {
    this._content = contentOptions;
  }

  /**
   * @returns The content property of the WidgetItem.
   */
  get content(): ContentOptions | undefined {
    return this._content;
  }

  /**
   * Sets the content to undefined
   */
  resetContent(): void {
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
   * @returns The groupBy property of the WidgetItem.
   */
  get groupBy(): string | undefined {
    return this._groupBy;
  }

  /** Sets the groupBy to undefined */
  resetGroupBy(): void {
    this._groupBy = undefined;
  }

  /**
   *
   * @param groupBy - the groupBy string.
   * @throws - {@link ErrorMessages.IV_0022}
   */
  private _validateGroupBy(groupBy?: string): void {
    if (typeof groupBy === 'string' && groupBy.trim().length === 0) throw new Error(ErrorMessages.IV_0022);
  }

  /** Set the search filter */
  set filter(filter: Filter) {
    this._filter = filter;
  }

  /** @returns The {@link Filter} filter property of the WidgetItem */
  get filter(): Filter | undefined {
    return this._filter;
  }

  /** Sets the filter to undefined */
  resetFilter(): void {
    this._filter = undefined;
  }

  /**
   *
   * @returns The content property in its DTO format {@link ContentOptionsDto}.
   */
  private _contentToDTO(): ContentOptionsDto | undefined {
    if (!this._content) return undefined;
    const { attributes, ...rest } = this._content;
    return { fields: attributes, ...rest };
  }

  /**
   * Maps the results item to its DTO format {@link ResultsItemDTO}.
   */
  protected _resultsToDTO(): ResultsItemDTO {
    return {
      ...(this._limit && { limit: this._limit }),
      ...(this._filter && { filter: this._filter.toDTO() }),
      ...(this._groupBy && { group_by: this._groupBy }),
      ...(this._content && { content: this._contentToDTO() }),
      ...(this._rule && { rule: this._ruleToDTO(this._rule) })
    };
  }
}
