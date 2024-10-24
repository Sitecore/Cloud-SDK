import { RecommendationWidgetItem } from './recommendation-widget-item';

describe('recommendation widget item class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('constructor', () => {
    it('should not set the recommendations main property', () => {
      const widgetItem = new RecommendationWidgetItem('content', 'rfkid_7');
      const dto = widgetItem.toDTO();
      expect(dto.recommendations).toBeUndefined();
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set the recommendations main property', () => {
      const widgetItem = new RecommendationWidgetItem('content', 'rfkid_7', {});
      const dto = widgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({});
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });

    it('should set the recommendations main property with an object', () => {
      const widgetItem = new RecommendationWidgetItem('content', 'rfkid_7', { test: 'test' });
      const dto = widgetItem.toDTO();
      expect(dto.recommendations).toBeDefined();
      expect(dto.recommendations).toEqual({ test: 'test' });
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_7');
    });
  });
});
