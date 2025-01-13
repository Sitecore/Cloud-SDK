'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { widgetSuggestionClick } from '@sitecore-cloudsdk/search/browser';

export default function WidgetSuggestionClickEvent() {
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

  const [widgetSuggestionClickEventData, setWidgetSuggestionClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","filters":[{"displayName":"test","name":"test","title":"test","value":"test","valuePosition":1}],"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetId":"12345"}'
  );

  return (
    <div>
      <h1>Send widget suggestion click event</h1>
      Send widget suggestion click event data:
      <textarea
        style={{ width: '1000px' }}
        value={widgetSuggestionClickEventData}
        onChange={(e) => setWidgetSuggestionClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='widgetSuggestionClickEvent'
        onClick={() => widgetSuggestionClick(JSON.parse(widgetSuggestionClickEventData))}>
        Send widget suggestion click event
      </button>
      <br />
    </div>
  );
}
