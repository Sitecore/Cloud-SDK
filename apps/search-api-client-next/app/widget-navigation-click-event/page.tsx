'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { widgetNavigationClick } from '@sitecore-cloudsdk/search-api-client/browser';

export default function WidgetNavigationClickEvent() {
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

  const [widgetNavigationClickEventData, setWidgetNavigationClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","itemPosition":1,"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","widgetIdentifier":"12345"}'
  );

  return (
    <div>
      <h1>Send widget navigation click event</h1>
      Send widget click event data:
      <textarea
        style={{ width: '1000px' }}
        value={widgetNavigationClickEventData}
        onChange={(e) => setWidgetNavigationClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='widgetNavigationClickEvent'
        onClick={() => widgetNavigationClick(JSON.parse(widgetNavigationClickEventData))}>
        Send widget click event
      </button>
      <br />
    </div>
  );
}
