import {
  ComparisonFilter,
  Context,
  getWidgetData,
  SearchWidgetItem,
  WidgetRequestData
} from '@sitecore-cloudsdk/search/browser';
import type { ComparisonOperators } from '@sitecore-cloudsdk/search/browser';
import type { ApiResponseWithContent } from '../types';

export async function getProductById(id: string) {
  return (await getProductsByAttribute('id', id))?.widgets[0].content[0];
}

export async function getProductsByAttribute(attribute: string, value: string, operator: ComparisonOperators = 'eq') {
  const searchWidget = new SearchWidgetItem('product', 'rfkid_7', {
    content: {},
    filter: new ComparisonFilter(attribute, operator, value)
  });

  const response = await getWidgetData(
    new WidgetRequestData([searchWidget]),
    new Context({ locale: { country: 'us', language: 'EN' } })
  );

  return response ? (response as ApiResponseWithContent) : null;
}
