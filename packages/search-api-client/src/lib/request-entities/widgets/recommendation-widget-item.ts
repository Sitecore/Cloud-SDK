// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { Filter, FilterDTO } from '../filters/interfaces';
import type { ContentType, WidgetItemRecommendation, WidgetItemRecommendationDTO } from './interfaces';
import { WidgetItem } from './widget-item';

export class RecommendationWidgetItem extends WidgetItem {
  protected _recommendations?: WidgetItemRecommendation;

  /**
   * Creates and holds the functionality of a recommendation widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param recommendations - The widget's item recommendations.
   */
  constructor(entity: string, rfkId: string, recommendations?: WidgetItemRecommendation) {
    super(entity, rfkId);

    this._validateLimit(recommendations?.limit);

    this._recommendations = recommendations;
  }

  /**
   * Sets the recommendation content for the RecommendationWidgetItem.
   * This method updates the `content` property of the recommendations configuration.
   * The value is used to define specific recommendation criteria.
   * @param value - {@link ContentType}.
   *
   */
  set content(value: ContentType) {
    this._recommendations = {
      ...this._recommendations,
      content: value
    };
  }

  /**
   * Sets the recommendation filters for the RecommendationWidgetItem.
   * This method updates the `filter` property of the recommendations configuration.
   * The value is used to define specific recommendation criteria.
   * @param filter - {@link Filter}.
   *
   */
  set filter(filter: Filter) {
    this._recommendations = {
      ...this._recommendations,
      filter
    };
  }

  /**
   * Sets the group_by operator for the the RecommendationWidgetItem.
   * This method updates the `attribute` property of the recommendations groupBy configuration.
   * @param attribute - The attribute that specifies what recommendation results are grouped by.
   */
  set groupBy(attribute: string) {
    this._recommendations = {
      ...this._recommendations,
      groupBy: attribute
    };
  }

  /**
   * Sets the search limit for the RecommendationWidgetItem.
   * This method updates the `limit` property of the recommendations configuration.
   * The limit is used to specify the maximum number of results to be returned, useful for controlling pagination.
   *
   * @param limit - The number to set as the search limit, which must be between 1 and 100, inclusive.
   *
   * @throws Error If the limit is less than 1 or greater than 100, indicating an invalid range.
   */

  set limit(limit: number) {
    this._validateLimit(limit);

    this._recommendations = {
      ...this._recommendations,
      limit
    };
  }

  private _validateLimit(limit?: number): void {
    if (typeof limit === 'number' && (limit < 1 || limit > 100)) throw new Error(ErrorMessages.IV_0007);
  }

  /**
   * Maps the recommendation widget item to its DTO format.
   */
  toDTO(): WidgetItemRecommendationDTO {
    const superDTO = super.toDTO();

    const recommendationsDTO = {
      ...(this._recommendations?.content && { content: this._recommendations.content }),
      ...(this._recommendations?.groupBy && { group_by: this._recommendations.groupBy }),
      ...(this._recommendations?.filter && { filter: this._recommendations.filter.toDTO() as FilterDTO }),
      ...(this._recommendations?.limit && { limit: this._recommendations.limit })
    };

    return this._recommendations ? { ...superDTO, recommendations: recommendationsDTO } : superDTO;
  }
}
