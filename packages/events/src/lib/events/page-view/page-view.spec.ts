import { pageView } from './page-view';
import { getDependencies } from '../../initializer/browser/initializer';
import { IPageViewEventInput, PageViewEvent } from './page-view-event';

jest.mock('../../initializer/browser/initializer', () => {
  return {
    getDependencies: jest.fn(() => {
      return {
        eventApiClient: 'mockedEventApiClient',
        id: 'mockedId',
        settings: {},
      };
    }),
  };
});

jest.mock('./page-view-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PageViewEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
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
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('pageView', () => {
  let eventData: IPageViewEventInput;
  afterEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };
    jest.clearAllMocks();
  });

  it('should send a PageViewEvent to the server', async () => {
    const extensionData = { extKey: 'extValue' };
    const response = await pageView(eventData, extensionData);

    expect(getDependencies).toHaveBeenCalled();
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient: 'mockedEventApiClient',
      eventData,
      extensionData,
      id: 'mockedId',
      searchParams: window.location.search,
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
  });
});
