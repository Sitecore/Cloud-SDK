import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import { LogicalFilter } from '../filters/logical-filter';
import { RecommendationWidgetItem } from './recommendation-widget-item';

describe('recommendation widget item class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recommendations main property', () => {
    it('should early return if no recommendation object is passed to constructor', () => {
      const stringifySpy = jest.spyOn(JSON, 'stringify');

      const widgetItem = new RecommendationWidgetItem('content', 'rfkid_7');

      expect(stringifySpy).not.toHaveBeenCalled();

      const dto = widgetItem.toDTO();
      expect(dto.recommendations).toBeUndefined();
    });

    it('should not set the recommendations main property', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeUndefined();
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set the recommendations main property', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {});
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({});
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set recommendations to an empty object when resetRecommendations is called', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {
        recipe: { id: 'recipe-id', version: 1 }
      });
      recommendationWidgetItem.resetRecommendations();

      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({});
    });

    it('should set the full object from constructor', () => {
      const uut = new RecommendationWidgetItem('test', 'test', {
        content: { fields: ['test'] },
        filter: new LogicalFilter('not', new ComparisonFilter('test', 'eq', 'te')),
        groupBy: 'groupBy',
        limit: 10,
        recipe: { id: 'recipe-id', version: 1 }
      });

      expect(uut.toDTO()).toEqual({
        entity: 'test',
        recommendations: {
          content: { fields: ['test'] },
          filter: { filter: { name: 'test', type: 'eq', value: 'te' }, type: 'not' },
          group_by: 'groupBy',
          limit: 10,
          recipe: { id: 'recipe-id', version: 1 }
        },
        rfk_id: 'test'
      });
    });

    it('should set values from result item', () => {
      const uut = new RecommendationWidgetItem('test', 'test', {
        content: { fields: ['test'] },
        filter: new LogicalFilter('not', new ComparisonFilter('test', 'eq', 'te')),
        groupBy: 'groupBy',
        limit: 10
      });

      expect(uut.toDTO()).toEqual({
        entity: 'test',
        recommendations: {
          content: { fields: ['test'] },
          filter: { filter: { name: 'test', type: 'eq', value: 'te' }, type: 'not' },
          group_by: 'groupBy',
          limit: 10
        },
        rfk_id: 'test'
      });
    });

    it('should not set any values', () => {
      const uut = new RecommendationWidgetItem('test', 'test');
      uut.resetRecommendations();
      const dto = uut.toDTO();

      expect(dto.recommendations?.recipe).toBeUndefined();
      expect(dto.recommendations?.content).toBeUndefined();

      expect(dto).toEqual({
        entity: 'test',
        recommendations: {},
        rfk_id: 'test'
      });
    });
  });

  describe('recipe', () => {
    it('should not set the recipe if not provided in constructor', () => {
      const isValidRecipeSpy = jest.spyOn(RecommendationWidgetItem.prototype as any, '_validateRecipe');
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {});
      const dto = recommendationWidgetItem.toDTO();

      expect(dto.recommendations).toEqual({});
      expect(isValidRecipeSpy).not.toHaveBeenCalled();
    });

    it('should set the recipe with valid values via constructor', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {
        recipe: { id: 'recipe-id', version: 1 }
      });
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({ recipe: { id: 'recipe-id', version: 1 } });
    });

    it('should set the recipe with valid values via setter', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      recommendationWidgetItem.recipe = { id: 'recipe-id', version: 2 };
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({ recipe: { id: 'recipe-id', version: 2 } });
    });

    it('should throw an error if recipe id is empty via constructor', () => {
      expect(() => {
        new RecommendationWidgetItem('content', 'rfkid_7', {
          recipe: { id: '', version: 1 }
        });
      }).toThrow(ErrorMessages.IV_0023);
    });

    it('should throw an error if recipe id contains only whitespace via constructor', () => {
      expect(() => {
        new RecommendationWidgetItem('content', 'rfkid_7', {
          recipe: { id: '   ', version: 1 }
        });
      }).toThrow(ErrorMessages.IV_0023);
    });

    it('should throw an error if recipe version is less than 1 via constructor', () => {
      expect(() => {
        new RecommendationWidgetItem('content', 'rfkid_7', {
          recipe: { id: 'recipe-id', version: 0 }
        });
      }).toThrow(ErrorMessages.IV_0024);
    });

    it('should throw an error if recipe id is empty via setter', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      expect(() => {
        recommendationWidgetItem.recipe = { id: '', version: 1 };
      }).toThrow(ErrorMessages.IV_0023);
    });

    it('should throw an error if recipe id contains only whitespace via setter', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      expect(() => {
        recommendationWidgetItem.recipe = { id: '   ', version: 1 };
      }).toThrow(ErrorMessages.IV_0023);
    });

    it('should throw an error if recipe version is less than 1 via setter', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      expect(() => {
        recommendationWidgetItem.recipe = { id: 'recipe-id', version: 0 };
      }).toThrow(ErrorMessages.IV_0024);
    });

    it('should not throw an error if recipe is undefined in constructor', () => {
      expect(() => {
        new RecommendationWidgetItem('content', 'rfkid_7', {});
      }).not.toThrow();
    });

    it('should combine recipe with other properties in toDTO', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      recommendationWidgetItem.content = { fields: ['test1'] };
      recommendationWidgetItem.recipe = { id: 'recipe-id', version: 1 };
      recommendationWidgetItem.limit = 5;
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({
        content: { fields: ['test1'] },
        limit: 5,
        recipe: { id: 'recipe-id', version: 1 }
      });
    });

    it('should reset the recipe', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {
        recipe: { id: 'recipe-id', version: 1 }
      });
      recommendationWidgetItem.resetRecipe();

      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations?.recipe).toBeUndefined();
    });
  });

  describe('RecommendationWidgetItem getters', () => {
    it('should get all properties', () => {
      const recipe = { id: 'recipe-id', version: 1 };

      const widgetItem = new RecommendationWidgetItem('content', 'rfkid_qa');

      expect(widgetItem.recipe).toBeUndefined();

      widgetItem.resetRecommendations();

      expect(widgetItem.recipe).toBeUndefined();

      widgetItem.recipe = recipe;

      expect(widgetItem.recipe).toEqual(recipe);
    });
  });
});
