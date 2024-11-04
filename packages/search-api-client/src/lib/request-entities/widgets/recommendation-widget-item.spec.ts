import { ComparisonFilter } from '../filters/comparison-filter';
import { GeoFilter } from '../filters/geo-filter';
import { RecommendationWidgetItem } from './recommendation-widget-item';

describe('recommendation widget item class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('constructor', () => {
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

    it('should set the recommendations.content with an empty object', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', { content: {} });
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({ content: {} });
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set the recommendations.content.fields with an array of stings', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {
        content: { fields: ['test1', 'test2'] }
      });
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({ content: { fields: ['test1', 'test2'] } });
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });
  });

  describe('content via setter', () => {
    it('should set the recommendations.content with an empty object', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      recommendationWidgetItem.content = {};
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({ content: {} });
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set the recommendations.content.fields an array of stings', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      recommendationWidgetItem.content = { fields: ['test1', 'test2'] };
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({ content: { fields: ['test1', 'test2'] } });
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });
  });

  describe('filters', () => {
    it('should set the filter to comparison filter', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');

      const filter = new ComparisonFilter('title', 'eq', 'title1');
      recommendationWidgetItem.filter = filter;
      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({ filter: { name: 'title', type: 'eq', value: 'title1' } });
    });

    it('should set the reccomendation object with filters and content', () => {
      const recommendationWidgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      recommendationWidgetItem.content = { fields: ['test1', 'test2'] };

      const filter = new GeoFilter('location', { location: { latitude: 90, longitude: 90 } });
      recommendationWidgetItem.filter = filter;

      const dto = recommendationWidgetItem.toDTO();
      expect(dto.recommendations).toEqual({
        content: { fields: ['test1', 'test2'] },
        filter: { lat: 90, lon: 90, name: 'location', type: 'geoDistance' }
      });
    });
  });
});
