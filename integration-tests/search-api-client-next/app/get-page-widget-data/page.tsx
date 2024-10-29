'use client';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { getPageWidgetData } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function GetPageWidgetData() {
  useEffect(() => {
    async function initSearch() {
      await CloudSDK({
        enableBrowserCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();
    }
    initSearch();
  }, []);

  const [inputPathnameData, setInputPathnameData] = useState('/search');

  const getPageWidgetDataFromAPIWithValidPayload = async () => {
    await fetch('/api/get-page-widget-data?testID=getPageWidgetDataFromAPIWithValidPayload');
  };

  const requestPageWidgetData = async () => {
    await getPageWidgetData(inputPathnameData as `/${string}`);
  };

  return (
    <div>
      <h1>Get page widget data page</h1>
      <button
        type='button'
        data-testid='getPageWidgetData'
        onClick={requestPageWidgetData}>
        Get Page Widget Data
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
      <button
        type='button'
        data-testid='getPageWidgetDataFromAPIWithValidPayload'
        onClick={getPageWidgetDataFromAPIWithValidPayload}>
        Get Page Widget Data From API With Valid Data
      </button>
    </div>
  );
}
