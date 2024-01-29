// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { awaitInit } from '../initializer/browser/initializer';
import { eventQueue } from './eventStorage';

/**
 * A function that sends all queue events to SitecoreCloud API.
 * Clears the queue upon completion.
 */
export async function processEventQueue(): Promise<void> {
  await awaitInit();

  eventQueue.sendAllEvents();
}
