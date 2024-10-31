// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
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
   * Maps the recommendation widget item to its DTO format.
   */
  toDTO(): WidgetItemRecommendationDTO {
    const superDTO = super.toDTO();
    return this._recommendations ? { ...superDTO, recommendations: this._recommendations } : superDTO;
  }
}
