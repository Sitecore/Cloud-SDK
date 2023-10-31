// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
export { getBrowserId } from 'packages/core/src/lib/init/get-browser-id';
export { init } from './lib/initializer/browser/initializer';
export type { IPageViewEventInput, ICustomEventInput, IIdentityEventAttributesInput } from './lib/events';
export { addToEventQueue } from './lib/eventStorage/addToEventQueue';
export { processEventQueue } from './lib/eventStorage/processEventQueue';
export { clearEventQueue } from './lib/eventStorage/clearEventQueue';
export { form } from './lib/events/custom-event/form';
export { event } from './lib/events/custom-event/event';
export { identity } from './lib/events/identity/identity';
export { pageView } from './lib/events/page-view/page-view';
