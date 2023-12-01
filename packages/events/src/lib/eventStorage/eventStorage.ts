// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { pageName, language } from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../ep/EventApiClient';
import { CustomEventArguments, CustomEvent } from '../events';

export class EventQueue {
  /**
   * Initialize the Event Storage
   * @param storage - Interface that describes the storage functionality
   * @param eventApiClient - The API client which sends events to EP
   * @param infer - The instance of the infer class
   */
  private key = 'EventQueue';
  constructor(private storage: Storage, private eventApiClient: EventApiClient) {}

  /** Returns the stored array of data with type QueueEventPayload, or empty array if the given key does not exist. */
  private getEventQueue(): QueueEventPayload[] {
    const storedQueue = this.storage.getItem(this.key);

    if (!storedQueue) return [];

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
    queueEventPayload.eventData.page = queueEventPayload.eventData.page ?? pageName();
    queueEventPayload.eventData.language = queueEventPayload.eventData.language ?? language();

    new CustomEvent({
      eventApiClient: this.eventApiClient,
      ...queueEventPayload,
    });

    const eventQueue = this.getEventQueue();
    eventQueue.push(queueEventPayload);

    this.storage.setItem(this.key, JSON.stringify(eventQueue));
  }
  /**
   * Iterates the queue, and sends sequently the custom events to Sitecore EP.
   */
  async sendAllEvents() {
    const eventQueue = this.getEventQueue();

    for (const queueEventPayload of eventQueue) {
      await new CustomEvent({
        eventApiClient: this.eventApiClient,
        eventData: queueEventPayload.eventData,
        extensionData: queueEventPayload.extensionData,
        id: queueEventPayload.id,
        settings: queueEventPayload.settings,
        type: queueEventPayload.type,
      }).send();
    }

    this.clearQueue();
  }

  /**
   * Clears the queue from storage.
   */
  clearQueue() {
    this.storage.removeItem(this.key);
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

export type QueueEventPayload = Pick<CustomEventArguments, 'eventData' | 'extensionData' | 'type' | 'settings' | 'id'>;
