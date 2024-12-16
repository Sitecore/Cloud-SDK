'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { Context, getPageWidgetData } from '@sitecore-cloudsdk/search-api-client/browser';

export default function GetPageWidgetData() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: 'TestSite',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .addSearch({ userId: 'test' })
      .initialize();
  }, []);

  const [inputPathnameData, setInputPathnameData] = useState('/search');
  const [inputContextData, setInputContextData] = useState('{"page":{"uri":"/search"}}');

  const getPageWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-page-widget-data?testID=getPageWidgetDataFromAPIWithValidPayload');
  };

  const requestPageWidgetData = async () => {
    await getPageWidgetData(inputPathnameData as `/${string}`);
  };

  const requestPageWidgetDataWithContext = async () => {
    await getPageWidgetData(new Context(JSON.parse(inputContextData)));
  };

  return (
    <div>
      <h1>Get page widget data page</h1>
      <button
        type='button'
        data-testid='getPageWidgetData'
        onClick={requestPageWidgetData}>
        Get Page Widget Data with Pathname
      </button>
      <button
        type='button'
        data-testid='getPageWidgetDataWithContext'
        onClick={requestPageWidgetDataWithContext}>
        Get Page Widget Data with Context
      </button>
      <br />
      Pathname data:
      <input
        style={{ width: '800px' }}
        type='text'
        value={inputPathnameData}
        onChange={(e) => setInputPathnameData(e.target.value)}
        data-testid='pathnameInput'
      />
      <br />
      Context data:
      <input
        style={{ width: '800px' }}
        type='text'
        value={inputContextData}
        onChange={(e) => setInputContextData(e.target.value)}
        data-testid='contextInput'
      />
      <br />
      <button
        type='button'
        data-testid='getPageWidgetDataFromAPIWithValidPayload'
        onClick={getPageWidgetDataFromAPIWithValidPayload}>
        Get Page Widget Data From API With Valid Data
      </button>
    </div>
  );
}
