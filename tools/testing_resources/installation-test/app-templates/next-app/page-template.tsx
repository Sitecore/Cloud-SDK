import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { entityView, getPageWidgetData } from '@sitecore-cloudsdk/search-api-client/browser';

function Home() {
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'async-init-events'
  };

  const personalizeData = { ...eventData, friendlyId: 'personalizeintegrationtest' };
  const searchData = {
    currency: 'EUR',
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    entity: {
      attributes: {
        author: 'ABC'
      },
      entity: 'category',
      entityType: 'subcat',
      id: '123',
      sourceId: '534',
      uri: 'https://www.sitecore.com/products/content-cloud'
    }
  };

  const initCloudSDK = useCallback(async () => {
    await CloudSDK({
      enableBrowserCookie: true,
      siteName: 'spinair.com',
      sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1'
    })
      .addEvents()
      .addPersonalize()
      .addSearch({ userId: 'test' })
      .initialize();
  }, []);

  useEffect(() => {
    initCloudSDK();
  }, [initCloudSDK]);

  const sendPageViewEvent = async () => {
    await pageView(eventData);
  };

  const sendPersonalize = async () => {
    await personalize(personalizeData);
  };

  const sendSearchEntityView = async () => {
    await entityView(searchData);
  };

  const sendGetPageWidgetData = async () => {
    await getPageWidgetData('/test');
  };

  return (
    <div className='Home'>
      <header className='Home-header'>
        <p>Create-next-app installation test</p>
        <button
          data-testid='sendEventBtn'
          onClick={sendPageViewEvent}>
          Send event
        </button>
        <button
          data-testid='sendPersonalizeBtn'
          onClick={sendPersonalize}>
          Send personalize
        </button>
        <button
          data-testid='sendGetPageWidgetDataBtn'
          onClick={sendGetPageWidgetData}>
          Send search
        </button>
        <button
          data-testid='sendSearchEntityViewBtn'
          onClick={sendSearchEntityView}>
          Send getPageWidgetData
        </button>
      </header>
    </div>
  );
}

export default Home;
