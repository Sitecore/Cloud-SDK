'use client';

import { useEffect } from 'react';
//import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import {
  // init as initEvents,
  addToEventQueue,
  clearEventQueue,
  event,
  form,
  getGuestId,
  identity,
  pageView,
  processEventQueue
} from '@sitecore-cloudsdk/events/browser';
import {
  //  init as initPersonalize,
  personalize
} from '@sitecore-cloudsdk/personalize/browser';
import {
  entityView,
  getPageWidgetData,
  getWidgetData,
  widgetFacetClick,
  WidgetItem,
  widgetItemClick,
  widgetNavigationClick,
  WidgetRequestData,
  widgetSuggestionClick,
  widgetView // init as initSearch
} from '@sitecore-cloudsdk/search-api-client/browser';

export default function Index() {
  //const runNewInit = async () => {
  // CloudSDK({
  //   sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
  //   siteName: 'spinair.com',
  //   enableBrowserCookie: true
  // })
  //   .addPersonalize()
  //   .addSearch({ userId: '123' })
  //   .addEvents()
  //   .initialize();
  //};
  // const runOldInit = async () => {
  //   initPersonalize({
  //     sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
  //     siteName: 'spinair.com',
  //     enableBrowserCookie: true
  //   });
  //   initSearch({
  //     sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
  //     sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
  //     siteName: 'spinair.com',
  //     enableBrowserCookie: true
  //   });
  //   initEvents({
  //     sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
  //     siteName: 'spinair.com',
  //     enableBrowserCookie: true
  //   });
  // };

  useEffect(() => {
    // runNewInit();
    // runOldInit();
  }, []);

  return (
    <div>
      <h1>Welcome to new initCloudSKD world!!</h1>
      <h2>Init with CloudSDK events, personalize and search.</h2>
      <ul>
        <li>
          <button
            onClick={() => {
              pageView();
              event({ type: 'TEST' });
              form('formId', 'VIEWED');
              identity({
                language: 'EN',
                currency: 'EUR',
                channel: 'WEB',
                email: 'test@test.com',
                identifiers: [{ id: '123', provider: 'email' }]
              });
              clearEventQueue();
              addToEventQueue({ type: 'TEST2' });
              processEventQueue();
              getGuestId();
            }}>
            Send Event
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              personalize({
                channel: 'WEB',
                currency: 'EUR',
                language: 'EN',
                friendlyId: 'personalizeintegrationtest'
              });
            }}>
            Send Personalize
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              widgetSuggestionClick({
                channel: 'WEB',
                currency: 'EUR',
                filters: [
                  {
                    displayName: 'test',
                    name: 'test',
                    title: 'test',
                    value: 'test',
                    valuePosition: 1
                  }
                ],
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                request: {
                  advancedQueryText: 'test1',
                  keyword: 'test_keyword',
                  modifiedKeyword: 'test2',
                  numRequested: 20,
                  numResults: 10,
                  pageNumber: 2,
                  pageSize: 1,
                  redirectUrl: 'test3',
                  totalResults: 10
                },
                widgetIdentifier: '12345'
              });
              widgetView({
                channel: 'WEB4',
                currency: 'EUR',
                entities: [
                  {
                    attributes: {
                      author: 'ABC'
                    },
                    entityType: 'subcat1',
                    entity: 'category1',
                    id: '123',
                    sourceId: '534',
                    uri: 'https://www.sitecore.com/products/content-cloud3333333'
                  },
                  {
                    attributes: {
                      author: 'XYZ'
                    },
                    entityType: 'subcat2',
                    entity: 'category2',
                    id: '678',
                    sourceId: '910',
                    uri: 'https://www.sitecore.com/products/content-cloud4444444'
                  }
                ],
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                request: {
                  advancedQueryText: 'test1',
                  keyword: 'test_keyword',
                  modifiedKeyword: 'test2',
                  numRequested: 20,
                  numResults: 10,
                  pageNumber: 2,
                  pageSize: 1,
                  redirectUrl: 'test3',
                  totalResults: 10
                },
                widgetIdentifier: '12345'
              });
              getPageWidgetData('/test');
              const widget = new WidgetItem('test', 'test');
              const widgetRequestData = new WidgetRequestData([widget]);
              getWidgetData(widgetRequestData);
              widgetFacetClick({
                channel: 'WEB',
                currency: 'EUR',
                filters: [
                  {
                    displayName: 'test',
                    facetPosition: 1,
                    name: 'test',
                    title: 'test',
                    value: 'test',
                    valuePosition: 1
                  },
                  {
                    displayName: 'test',
                    endValue: '1',
                    name: 'test',
                    startValue: '1',
                    title: 'test',
                    value: 'test',
                    valuePosition: 1
                  }
                ],
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                request: {
                  advancedQueryText: 'test1',
                  keyword: 'test_keyword',
                  modifiedKeyword: 'test2',
                  numRequested: 20,
                  numResults: 10,
                  pageNumber: 2,
                  pageSize: 1,
                  redirectUrl: 'test3',
                  totalResults: 10
                },
                widgetIdentifier: '12345'
              });

              entityView({
                currency: 'EUR',
                entity: {
                  attributes: {
                    author: 'ABC'
                  },
                  entity: 'category',
                  entityType: 'subcat',
                  id: '123',
                  sourceId: '534',
                  uri: 'https://www.sitecore.com/products/content-cloud3333333'
                },
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud'
              });
              widgetItemClick({
                channel: 'WEB',
                currency: 'EUR',
                entity: {
                  attributes: {
                    author: 'ABC'
                  },
                  entity: 'category',
                  entityType: 'subcat',
                  id: '123',
                  sourceId: '534',
                  uri: 'https://www.sitecore.com/products/content-cloud3333333'
                },
                itemPosition: 1,
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                request: {
                  advancedQueryText: 'test1',
                  keyword: 'test_keyword',
                  modifiedKeyword: 'test2',
                  numRequested: 20,
                  numResults: 10,
                  pageNumber: 2,
                  pageSize: 1,
                  redirectUrl: 'test3',
                  totalResults: 10
                },
                widgetIdentifier: '12345'
              });
              widgetFacetClick({
                channel: 'WEB',
                currency: 'EUR',
                filters: [
                  {
                    displayName: 'test',
                    facetPosition: 1,
                    name: 'test',
                    title: 'test',
                    value: 'test',
                    valuePosition: 1
                  },
                  {
                    displayName: 'test',
                    endValue: '1',
                    name: 'test',
                    startValue: '1',
                    title: 'test',
                    value: 'test',
                    valuePosition: 1
                  }
                ],
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                request: {
                  advancedQueryText: 'test1',
                  keyword: 'test_keyword',
                  modifiedKeyword: 'test2',
                  numRequested: 20,
                  numResults: 10,
                  pageNumber: 2,
                  pageSize: 1,
                  redirectUrl: 'test3',
                  totalResults: 10
                },
                widgetIdentifier: '12345'
              });
              widgetNavigationClick({
                channel: 'WEB',
                currency: 'EUR',
                itemPosition: 1,
                language: 'EN',
                page: 'test',
                pathname: 'https://www.sitecore.com/products/content-cloud',
                widgetIdentifier: '12345'
              });
            }}>
            Send Search
          </button>
        </li>
      </ul>
    </div>
  );
}
