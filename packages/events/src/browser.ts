// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export { getBrowserId } from '@sitecore-cloudsdk/core/internal';
export { init } from './lib/init/browser/initializer';
export type { PageViewData, EventData, IdentityData } from './lib/events';
export { addToEventQueue } from './lib/eventStorage/addToEventQueue';
export { processEventQueue } from './lib/eventStorage/processEventQueue';
export { clearEventQueue } from './lib/eventStorage/clearEventQueue';
export { form } from './lib/events/custom-event/form';
export { event } from './lib/events/custom-event/event';
export { identity } from './lib/events/identity/identity';
export { pageView } from './lib/events/page-view/page-view';
export { getGuestId } from './lib/getGuestId/getGuestId';
export { PACKAGE_VERSION, EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_INITIALIZER_METHOD_NAME } from './lib/consts';
import './lib/initializer/browser/initializer';
