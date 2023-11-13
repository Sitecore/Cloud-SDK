/* eslint-disable  @typescript-eslint/no-explicit-any */
import { EventApiClient } from '../cdp/EventApiClient';
import { ICustomEventInput, CustomEvent } from '../events/custom-event/custom-event';
import { EventQueue, QueueEventPayload } from './eventStorage';
import * as core from '@sitecore-cloudsdk/core';

jest.mock('../events/custom-event/custom-event');
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('Event Storage', () => {
  const eventApiClient = new EventApiClient('http://test.com', '123', '456');
  const inferLanguageSpy = jest.spyOn(core, 'language');
  const inferPageSpy = jest.spyOn(core, 'pageName');

  let eventData: ICustomEventInput;
  const id = 'test_id';

  const settings: core.ISettings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };

  const type = 'CUSTOM_TYPE';

  const storageMock = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };

    global.sessionStorage.getItem = jest.fn();
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getEventQueue should return empty array when no event is added to the queue', () => {
    const arrMock = jest.spyOn(global.Array, 'isArray');

    storageMock.getItem = jest.fn().mockReturnValueOnce(null);
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings,
      type,
    };
    const storage = new EventQueue(storageMock, eventApiClient);
    storage.enqueueEvent(queueEventPayload);

    expect(inferLanguageSpy).toHaveBeenCalledTimes(0);
    expect(inferPageSpy).toHaveBeenCalledTimes(0);

    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(arrMock).toBeCalledTimes(0);
    expect(storageMock.getItem).toHaveBeenCalledTimes(1);
  });

  it('getEventQueue should return an empty array when getItem returns a string thats not parsed as an Array', () => {
    const mockArray: QueueEventPayload[] = [];
    eventData.page = undefined;
    eventData.language = undefined;
    storageMock.getItem = jest.fn().mockReturnValueOnce('"dadada"');
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings,
      type,
    };
    mockArray.push(queueEventPayload);
    const storage = new EventQueue(storageMock, eventApiClient);
    storage.enqueueEvent(queueEventPayload);

    expect(inferLanguageSpy).toHaveBeenCalledTimes(1);
    expect(inferPageSpy).toHaveBeenCalledTimes(1);

    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(eventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('getEventQueue should return an empty array when JSON.parse throws error', () => {
    const mockArray: QueueEventPayload[] = [];
    storageMock.getItem = jest.fn().mockReturnValueOnce('dadada');
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings,
      type,
    };
    mockArray.push(queueEventPayload);
    const storage = new EventQueue(storageMock, eventApiClient);
    storage.enqueueEvent(queueEventPayload);

    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(eventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('enqueueEvent should update the storage value when no event is added yet', () => {
    const mockArray: QueueEventPayload[] = [];
    storageMock.getItem = jest.fn().mockReturnValueOnce(null);
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings,
      type,
    };
    mockArray.push(queueEventPayload);
    const storage = new EventQueue(storageMock, eventApiClient);
    storage.enqueueEvent(queueEventPayload);
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenNthCalledWith(1, {
      eventApiClient,
      eventData: eventData,
      id: id,
      settings: settings,
      type: type,
    });

    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(eventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('enqueueEvent should update the storage value when storage event in not empty', () => {
    const mockArray: QueueEventPayload[] = [];

    const queueEventPayloadTwo: QueueEventPayload = { eventData, id: 'testId2', settings, type };
    const queueEventPayloadThree: QueueEventPayload = { eventData, id: 'testId3', settings, type };

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);

    storageMock.getItem = jest.fn().mockReturnValueOnce(JSON.stringify(mockArray));

    const storage = new EventQueue(storageMock, eventApiClient);
    const queueEventPayload: QueueEventPayload = { eventData, id, settings, type };
    mockArray.push(queueEventPayload);
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');
    storage.enqueueEvent(queueEventPayload);

    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
    expect(eventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
    expect(storageMock.getItem).toHaveBeenCalledTimes(1);
  });

  it('sendAllEvents should send all stored events to CDP.', async () => {
    jest.spyOn(CustomEvent.prototype as any, 'send').mockResolvedValue({ status: 'OK' } as core.ICdpResponse);
    const eventQueueSpy = jest.spyOn(EventQueue.prototype as any, 'getEventQueue');

    const mockArray: QueueEventPayload[] = [];
    const queueEventPayloadTwo: QueueEventPayload = { eventData, id: 'testId1', settings, type };
    const queueEventPayloadThree: QueueEventPayload = { eventData, id: 'testId2', settings, type };
    const queueEventPayloadFour: QueueEventPayload = { eventData, id: 'testId3', settings, type };

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);
    mockArray.push(queueEventPayloadFour);

    eventQueueSpy.mockReturnValueOnce(mockArray);

    const storage = new EventQueue(storageMock, eventApiClient);

    storage.sendAllEvents();
    expect(eventQueueSpy).toHaveBeenCalledTimes(1);
  });

  it('clearQueue should call the removeItem from interface', () => {
    const storage = new EventQueue(storageMock, eventApiClient);
    storage.clearQueue();
    expect(storageMock.removeItem).toHaveBeenCalledTimes(1);
    expect(storageMock.removeItem).toHaveBeenCalledWith('EventQueue');
  });

  it('sendAllEvents should send events in the queue and clear the queue', async () => {
    jest.spyOn(CustomEvent.prototype as any, 'send').mockResolvedValue({ status: 'OK' } as core.ICdpResponse);
    const mockArray: QueueEventPayload[] = [];

    const queueEventPayloadTwo: QueueEventPayload = { eventData, id: 'testId2', settings, type };
    const queueEventPayloadThree: QueueEventPayload = { eventData, id: 'testId3', settings, type };

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);

    storageMock.getItem = jest.fn().mockReturnValueOnce(JSON.stringify(mockArray));

    const storage = new EventQueue(storageMock, eventApiClient);

    await storage.sendAllEvents();

    expect(CustomEvent).toHaveBeenCalledTimes(2);
    expect(CustomEvent).toHaveBeenNthCalledWith(1, {
      eventApiClient,
      eventData: queueEventPayloadTwo.eventData,
      extensionData: queueEventPayloadTwo.extensionData,
      id: queueEventPayloadTwo.id,
      settings: queueEventPayloadTwo.settings,
      type: queueEventPayloadTwo.type,
    });
    expect(CustomEvent).toHaveBeenNthCalledWith(2, {
      eventApiClient,
      eventData: queueEventPayloadThree.eventData,
      extensionData: queueEventPayloadThree.extensionData,
      id: queueEventPayloadThree.id,
      settings: queueEventPayloadThree.settings,
      type: queueEventPayloadThree.type,
    });

    expect(storageMock.removeItem).toHaveBeenCalledTimes(1);
    expect(storageMock.removeItem).toHaveBeenCalledWith('EventQueue');
  });
});
