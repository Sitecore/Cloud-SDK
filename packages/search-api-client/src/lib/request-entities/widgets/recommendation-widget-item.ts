// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { RecommendationWidgetItemDTO, WidgetItemRecommendation } from './interfaces';
import { WidgetItem } from './widget-item';

export class RecommendationWidgetItem extends WidgetItem {
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
   * Maps the recommendation widget item to its DTO format.
   */
  toDTO(): RecommendationWidgetItemDTO {
    const superDTO = super.toDTO();
    return superDTO.recommendations ? { ...superDTO, recommendations: { ...superDTO.recommendations } } : superDTO;
  }
}
