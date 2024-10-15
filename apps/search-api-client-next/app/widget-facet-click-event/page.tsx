'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { widgetFacetClick } from '@sitecore-cloudsdk/search-api-client/browser';

export default function WidgetFacetClickEvent() {
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

  const [widgetFacetClickEventData, setWidgetFacetClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","filters":[{"displayName":"test","facetPosition":1,"name":"test","title":"test","value":"test","valuePosition":1},{"displayName": "test","endValue": "1","name": "test","startValue":"1","title":"test","value":"test","valuePosition":1}],"request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetId":"12345"}'
  );

  return (
    <div>
      <h1>Send widget facet click event</h1>
      Send widget facet click event data:
      <textarea
        style={{ width: '1000px' }}
        value={widgetFacetClickEventData}
        onChange={(e) => setWidgetFacetClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='widgetFacetClickEvent'
        onClick={() => widgetFacetClick(JSON.parse(widgetFacetClickEventData))}>
        Send widget facet click event
      </button>
      <br />
    </div>
  );
}
