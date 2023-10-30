// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getDependencies } from '../initializer/browser/initializer';

/**
 * Deletes the queue from session.
 */
export function clearEventQueue(): void {
  const { eventQueue } = getDependencies();
  eventQueue.clearQueue();
}
