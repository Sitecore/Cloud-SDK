// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import './lib/initializer/server/initializer';

export { WidgetRequestData } from './lib/request-entities/widgets/widget-request-data';
export { WidgetItem } from './lib/request-entities/widgets/widget-item';
export { SearchWidgetItem } from './lib/request-entities/widgets/search-widget-item';
export { LogicalFilter } from './lib/request-entities/filters/logical-filter';
export { ComparisonFilter } from './lib/request-entities/filters/comparison-filter';
export { GeoFilter } from './lib/request-entities/filters/geo-filter';
export { ListFilter } from './lib/request-entities/filters/list-filter';
export { GeoWithinFilter } from './lib/request-entities/filters/geo-within-filter';
export { Context } from './lib/request-entities/context/context';
export type { ServerSettings } from './lib/types';
export type { GeoData } from './lib/request-entities/context/interfaces';

export { getSettings, initServer as init } from './lib/init/server/initializer';
export { getWidgetDataServer as getWidgetData } from './lib/requests/server/get-widget-data-server';
export { getPageWidgetDataServer as getPageWidgetData } from './lib/requests/server/get-page-widget-data-server';
export { widgetViewServer as widgetView } from './lib/requests/server/widget-view-event-server';

/* eslint-disable max-len */
export { widgetNavigationClickServer as widgetNavigationClick } from './lib/requests/server/widget-navigation-click-event-server';
export { widgetItemClickServer as widgetItemClick } from './lib/requests/server/widget-item-click-event-server';
export { widgetFacetClickServer as widgetFacetClick } from './lib/requests/server/widget-facet-click-event-server';
export { widgetSuggestionClickServer as widgetSuggestionClick } from './lib/requests/server/widget-suggestion-click-event-server';
/* eslint-enable max-len */
export { entityViewServer as entityView } from './lib/requests/server/entity-view-event-server';

export { SEARCH_NAMESPACE } from './lib/consts';
