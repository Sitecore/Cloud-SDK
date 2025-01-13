// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import './lib/initializer/server/initializer';

export { eventServer as event } from './lib/events/custom-event/eventServer';
export { identityServer as identity } from './lib/events/identity/identityServer';
export { pageViewServer as pageView } from './lib/events/page-view/page-view-server';
export { PACKAGE_VERSION, EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_INITIALIZER_METHOD_NAME } from './lib/consts';
export type { PageViewData, EventData, IdentityData } from './lib/events';
