// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getDependencies } from '../initializer/browser/initializer';

/**
 * A function that sends all queue events to SitecoreCloud API.
 * Clears the queue upon completion.
 */
export function processEventQueue(): void {
  const { eventQueue } = getDependencies();
  eventQueue.sendAllEvents();
}
