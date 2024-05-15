import { ErrorMessages } from '../../const';
import { WidgetItem } from './widget-item';
import { WidgetRequestData } from './widget-request-data';

describe('widget request data class', () => {
  describe('validator', () => {
    it(`should not throw an error if all properties are correct`, () => {
      const widgetItem = new WidgetItem('test', 'test');

      expect(() => new WidgetRequestData([widgetItem])).not.toThrow();
    });
    it(`should throw an error if array is empty`, () => {
      expect(() => new WidgetRequestData([])).toThrow(ErrorMessages.MV_0011);
    });
  });
  describe('mapper', () => {
    it('should return an array of widget items mapped to their DTO format', () => {
      const widgetItem1 = new WidgetItem('test1', 'test1');
      const widgetItem2 = new WidgetItem('test2', 'test2');
      const expected = {
        widget: {
          items: [
            {
              entity: 'test1',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              rfk_id: 'test1'
            },
            {
              entity: 'test2',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              rfk_id: 'test2',
              search: undefined
            }
          ]
        }
      };

      const result = new WidgetRequestData([widgetItem1, widgetItem2]).toDTO();

      expect(result).toEqual(expected);
    });
  });
});
