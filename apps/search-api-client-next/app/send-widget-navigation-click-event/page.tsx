'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { sendWidgetNavigationClickEvent } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function SendWidgetClickEvent() {
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

  const [sendWidgetNavigationClickEventData, setSendWidgetNavigationClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","itemPosition":1,"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","widgetIdentifier":"12345"}'
  );

  return (
    <div>
      <h1>Send widget navigation click event</h1>
      Send widget click event data:
      <textarea
        style={{ width: '1000px' }}
        value={sendWidgetNavigationClickEventData}
        onChange={(e) => setSendWidgetNavigationClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='sendWidgetNavigationClickEvent'
        onClick={() => sendWidgetNavigationClickEvent(JSON.parse(sendWidgetNavigationClickEventData))}>
        Send widget click event
      </button>
      <br />
    </div>
  );
}
