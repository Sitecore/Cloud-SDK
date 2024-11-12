// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { Filter, FilterDTO, LogicalOperators } from '../filters/interfaces';
import type { ContentType, WidgetItemDTO, WidgetItemSearch } from './interfaces';

export class WidgetItem {
  protected entity: string;
  protected rfkId: string;
  protected _search?: WidgetItemSearch;

  /**
   * Creates and holds the functionality of a widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   *
   */
  constructor(entity: string, rfkId: string) {
    this._validate(entity, rfkId);

    this.entity = entity;
    this.rfkId = rfkId;
  }

  private _validate(entity: string, rfkId: string) {
    if (!entity || entity.trim().length === 0) throw new Error(ErrorMessages.MV_0010);

    if (!rfkId || rfkId.trim().length === 0) throw new Error(ErrorMessages.MV_0011);
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
    if (limit < 1 || limit > 100) throw new Error(ErrorMessages.IV_0007);

    this._search = {
      ...this._search,
      limit
    };
  }

  /**
   * Sets the search offset for the WidgetItem.
   * Updates the offset property to manage pagination. Throws an error if the offset value is less than 0.
   * @param offset - The non-negative integer to set as the search offset.
   * @throws Error If the offset is less than 0.
   */
  set offset(offset: number) {
    if (offset < 0) throw new Error(ErrorMessages.IV_0008);
    this._search = {
      ...this._search,
      offset
    };
  }

  /**
   * Sets the search content for the WidgetItem.
   * This method updates the `content` property of the search configuration within the WidgetItem instance.
   * The fields is used to define specific search criteria or filters.
   * @param fields - The array fields that specifies the search criteria.
   */
  set content(value: ContentType) {
    this._search = {
      ...this._search,
      content: value
    };
  }
  /**
   * Sets the search keyphrase for the WidgetItem.
   * This method updates the `keyphrase` property of the search configuration within the WidgetItem instance.
   * The keyphrase is used to define specific search criteria.
   * @param keyphrase - A string that specifies the search criteria.
   * @throws Error If the keyphrase is not between 1 and 100 characters
   */
  set keyphrase(keyphrase: string) {
    if (keyphrase.length < 1 || keyphrase.length > 100) throw new Error(ErrorMessages.IV_0009);
    this._search = {
      ...this._search,
      query: {
        ...this._search?.query,
        keyphrase
      }
    };
  }
  /**
   * Sets the search operator for the WidgetItem.
   * This method updates the `operator` property of the search configuration within the WidgetItem instance.
   * The operator is used to define specific search criteria.
   * @param operator - The operator that specifies the search criteria.
   */
  set operator(operator: Exclude<LogicalOperators, 'not'>) {
    this._search = {
      ...this._search,
      query: {
        keyphrase: this._search?.query?.keyphrase ?? (undefined as unknown as string),
        operator
      }
    };
  }

  /**
   * Sets the group_by operator for search object of the WidgetItem.
   * This method updates the `attribute` property of the search configuration within the WidgetItem instance.
   * @param attribute - The attribute that specifies what search results are grouped by.
   */
  set groupBy(attribute: string) {
    this._search = {
      ...this._search,
      groupBy: attribute
    };
  }

  /**
   * Reset the search query object for the WidgetItem.
   * This method resets the `query` property of the search configuration within the WidgetItem instance.
   */
  resetSearchQuery() {
    this._search = {
      ...this._search,
      query: undefined
    };
  }

  /**
   * Set the search filter
   */
  set filter(filter: Filter) {
    this._search = {
      ...this._search,
      filter
    };
  }

  /**
   * Sets the search filter to undefined
   */
  removeSearchFilter() {
    this._search = {
      ...this._search,
      filter: undefined
    };
  }
  /**
   * Sets the search content to undefined
   */
  resetSearchContent() {
    this._search = {
      ...this._search,
      content: undefined
    };
  }

  /**
   * Maps the widget item to its DTO format.
   */
  toDTO(): WidgetItemDTO {
    const dto: WidgetItemDTO = {
      entity: this.entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rfk_id: this.rfkId
    };

    if (this._search && JSON.stringify(this._search) !== '{}')
      dto.search = {
        ...(this._search.content && { content: this._search.content }),
        ...(this._search.filter && { filter: this._search.filter.toDTO() as FilterDTO }),
        ...(this._search.groupBy && { group_by: this._search.groupBy }),
        ...(this._search.limit && { limit: this._search.limit }),
        ...(typeof this._search.offset === 'number' && { offset: this._search.offset }),
        ...(this._search.query && { query: this._search.query })
      };

    return dto;
  }
}
