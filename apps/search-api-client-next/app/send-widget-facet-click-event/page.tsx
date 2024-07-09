'use client';

import { BrowserSettings, init, sendWidgetFacetClickEvent } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function SendWidgetFacetClickEvent() {
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

  const [sendWidgetFacetClickEventData, setSendWidgetFacetClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","filters":[{"displayName":"test","facetPosition":1,"name":"test","title":"test","value":"test","valuePosition":1},{"displayName": "test","endValue": "1","name": "test","startValue":"1","title":"test","value":"test","valuePosition":1}],"request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetIdentifier":"12345"}'
  );

  return (
    <div>
      <h1>Send widget facet click event</h1>
      Send widget facet click event data:
      <textarea
        style={{ width: '1000px' }}
        value={sendWidgetFacetClickEventData}
        onChange={(e) => setSendWidgetFacetClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='sendWidgetFacetClickEvent'
        onClick={() => sendWidgetFacetClickEvent(JSON.parse(sendWidgetFacetClickEventData))}>
        Send widget facet click event
      </button>
      <br />
    </div>
  );
}
