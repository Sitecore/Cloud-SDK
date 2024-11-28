// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import './lib/initializer/browser/initializer';

export { WidgetRequestData } from './lib/request-entities/widgets/widget-request-data';
export { SearchWidgetItem } from './lib/request-entities/widgets/search-widget-item';
export { RecommendationWidgetItem } from './lib/request-entities/widgets/recommendation-widget-item';
export { QuestionsAnswersWidgetItem } from './lib/request-entities/widgets/questions-answers-widget-item';
export { LogicalFilter } from './lib/request-entities/filters/logical-filter';
export { ComparisonFilter } from './lib/request-entities/filters/comparison-filter';
export { ComparisonFacetFilter } from './lib/request-entities/filters/facet/comparison-facet-filter';
export { ListFacetFilter } from './lib/request-entities/filters/facet/list-facet-filter';
export { GeoFilter } from './lib/request-entities/filters/geo-filter';
export { ListFilter } from './lib/request-entities/filters/list-filter';
export { GeoWithinFilter } from './lib/request-entities/filters/geo-within-filter';
export { Context } from './lib/request-entities/context/context';
export { LogicalFacetFilter } from './lib/request-entities/filters/facet/logical-facet-filter';
export { NotFacetFilter } from './lib/request-entities/filters/facet/not-facet-filter';

export type { BrowserSettings } from './lib/types';
export type { GeoData } from './lib/request-entities/context/interfaces';
export type {
  FacetOptions,
  QueryOptions,
  ContentOptions,
  Recipe,
  SearchOptions,
  RecommendationOptions,
  QuestionsAnswersOptions,
  ExactAnswerOptions,
  RelatedQuestionsOptions
} from './lib/request-entities/widgets/interfaces';
export type { WidgetItem } from './lib/request-entities/widgets/widget-item';

export { getWidgetData } from './lib/requests/browser/get-widget-data';
export { getPageWidgetData } from './lib/requests/browser/get-page-widget-data';
export { widgetNavigationClick } from './lib/requests/browser/widget-navigation-click-event';
export { getSettings, init } from './lib/init/browser/initializer';
export { widgetItemClick } from './lib/requests/browser/widget-item-click-event';
export { widgetSuggestionClick } from './lib/requests/browser/widget-suggestion-click-event';
export { widgetFacetClick } from './lib/requests/browser/widget-facet-click-event';
export { widgetView } from './lib/requests/browser/widget-view-event';
export { entityView } from './lib/requests/browser/entity-view-event';

export { SEARCH_NAMESPACE } from './lib/consts';
