// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type {
  Recipe,
  Recommendation,
  RecommendationDTO,
  RecommendationOptions,
  WidgetItemRecommendationDTO
} from './interfaces';
import { ResultsWidgetItem } from './results-widget-item';

export class RecommendationWidgetItem extends ResultsWidgetItem {
  protected _recommendation?: Recommendation;

  /**
   * Creates and holds the functionality of a recommendation widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   * @param recommendationOptions - The widget's recommendation options object.
   */
  constructor(entity: string, widgetId: string, recommendationOptions?: RecommendationOptions) {
    const { recipe, ...rest } = recommendationOptions || {};

    super(entity, widgetId, rest);

    if (!recommendationOptions) return;

    if (!Object.keys(recommendationOptions).length) {
      this._recommendation = {};
      return;
    }

    this._validateRecipe(recipe);

    this._recommendation = { recipe };
  }

  /**
   * Sets the recommendations to an empty object.
   */
  resetRecommendations() {
    this._recommendation = {};
  }

  /**
   * Sets the recipe for the RecommendationWidgetItem.
   * This method updates the `recipe` property of the recommendations configuration.
   * The recipe is used to specify which recommendation algorithm to use.
   * If not provided, the API uses the recipe specified in CEC.
   *
   * @param recipe - {@link Recipe} The recipe configuration with id and version.
   * @throws Error If the recipe id is empty or version is less than 1.
   */
  set recipe(recipe: Recipe) {
    this._validateRecipe(recipe);

    this._recommendation = {
      ...this._recommendation,
      recipe
    };
  }

  /**
   * @returns The recipe property of the RecommendationWidgetItem.
   */
  get recipe(): Recipe | undefined {
    return this._recommendation?.recipe;
  }

  /**
   * Sets the recipe to undefined
   */
  resetRecipe() {
    this._recommendation = undefined;
  }

  private _validateRecipe(recipe?: Recipe) {
    if (!recipe) return;

    this._validateNonEmptyString(ErrorMessages.IV_0023, recipe.id);
    if (recipe.version < 1) throw new Error(ErrorMessages.IV_0024);
  }

  /**
   * Maps the recommendation widget item to its DTO format.
   */
  toDTO(): WidgetItemRecommendationDTO {
    const baseDTO = super.toDTO();
    const resultsDTO = this._resultsToDTO();

    const recommendationsDTO: RecommendationDTO = {
      ...(this._recommendation?.recipe && { recipe: this._recommendation.recipe }),
      ...resultsDTO
    };

    const dto: WidgetItemRecommendationDTO = {
      ...baseDTO,
      recommendations: Object.values(recommendationsDTO).length || this._recommendation ? recommendationsDTO : undefined
    };

    return dto;
  }
}
