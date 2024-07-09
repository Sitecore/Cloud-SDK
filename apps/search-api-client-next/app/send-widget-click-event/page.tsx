'use client';

import { BrowserSettings, init, sendWidgetClickEvent } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function SendWidgetClickEvent() {
  useEffect(() => {
    const settings: BrowserSettings = {
      enableBrowserCookie: true,
      siteName: 'TestSite',
      sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string,
      userId: 'test'
    };
    async function initSearch() {
      await init(settings);
    }
    initSearch();
  }, []);

  const [sendWidgetClickEventData, setSendWidgetClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","entity":{"attributes":{"author":"ABC"},"entity":"category","entityType":"subcat","id":"123","sourceId":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"},"itemPosition":1,"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetIdentifier":"12345"}'
  );

  return (
    <div>
      <h1>Send widget click event</h1>
      Send widget click event data:
      <textarea
        style={{ width: '1000px' }}
        value={sendWidgetClickEventData}
        onChange={(e) => setSendWidgetClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='sendWidgetClickEvent'
        onClick={() => sendWidgetClickEvent(JSON.parse(sendWidgetClickEventData))}>
        Send widget click event
      </button>
      <br />
    </div>
  );
}
