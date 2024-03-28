// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { pageName, language } from '@sitecore-cloudsdk/core';
import { CustomEventArguments, CustomEvent } from '../events';
import { sendEvent } from '../events/send-event/sendEvent';

class EventQueue {
  /**
   * Initialize the Event Storage
   */
  private key = 'EventQueue';

  /** Returns the stored array of data with type QueueEventPayload, or empty array if the given key does not exist. */
  private getEventQueue(): QueueEventPayload[] {
    const sessionStorage = this.getSessionStorage();

    const storedQueue = sessionStorage.getItem(this.key) ?? '""';

    try {
      const parsedQueueEvent: QueueEventPayload[] = JSON.parse(storedQueue);

      return Array.isArray(parsedQueueEvent) ? parsedQueueEvent : [];
    } catch {
      return [];
    }
  }

  /**
   * Adds the required event data to the queue and stores it in the storage.
   * @param queueEventPayload - The required event data for the creation of a CustomEvent.
   * Performs validation by creating a new CustomEvent.
   */
  enqueueEvent(queueEventPayload: QueueEventPayload) {
    const sessionStorage = this.getSessionStorage();

    queueEventPayload.eventData.page = queueEventPayload.eventData.page ?? pageName();
    queueEventPayload.eventData.language = queueEventPayload.eventData.language ?? language();

    new CustomEvent({
      sendEvent,
      ...queueEventPayload,
    });

    const eventQueue = this.getEventQueue();
    eventQueue.push(queueEventPayload);

    sessionStorage.setItem(this.key, JSON.stringify(eventQueue));
  }
  /**
   * Iterates the queue, and sends sequently the custom events to Sitecore EP.
   */
  async sendAllEvents() {
    const eventQueue = this.getEventQueue();

    for (const queueEventPayload of eventQueue) {
      await new CustomEvent({
        eventData: queueEventPayload.eventData,
        id: queueEventPayload.id,
        sendEvent,
        settings: queueEventPayload.settings,
      }).send();
    }

    this.clearQueue();
  }

  /**
   * Clears the queue from storage.
   */
  clearQueue() {
    const sessionStorage = this.getSessionStorage();
    sessionStorage.removeItem(this.key);
  }

  private getSessionStorage() {
    return sessionStorage;
  }
}

/**
 * This Storage interface represents the required storage functionality.
 */
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type QueueEventPayload = Pick<CustomEventArguments, 'eventData' | 'settings' | 'id'>;

export const eventQueue = new EventQueue();
