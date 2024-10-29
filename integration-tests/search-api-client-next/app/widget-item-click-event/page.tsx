'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { widgetItemClick } from '@sitecore-cloudsdk/search-api-client/browser';

export default function WidgetClickEvent() {
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

  const [widgetItemClickEventData, setWidgetItemClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","entity":{"attributes":{"author":"ABC"},"entity":"category","entityType":"subcat","id":"123","sourceId":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"},"itemPosition":1,"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetId":"12345"}'
  );

  return (
    <div>
      <h1>Send widget click event</h1>
      Send widget click event data:
      <textarea
        style={{ width: '1000px' }}
        value={widgetItemClickEventData}
        onChange={(e) => setWidgetItemClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='widgetItemClickEvent'
        onClick={() => widgetItemClick(JSON.parse(widgetItemClickEventData))}>
        Send widget click event
      </button>
      <br />
    </div>
  );
}
