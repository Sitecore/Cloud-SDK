// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { eventQueue } from './eventStorage';

/**
 * Deletes the queue from session.
 */
export function clearEventQueue(): void {
  eventQueue.clearQueue();
}
