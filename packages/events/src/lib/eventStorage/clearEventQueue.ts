// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { awaitInit } from '../init/browser/initializer';
import { eventQueue } from './eventStorage';

/**
 * Deletes the queue from session.
 */
export async function clearEventQueue(): Promise<void> {
  await awaitInit();

  eventQueue.clearQueue();
}
