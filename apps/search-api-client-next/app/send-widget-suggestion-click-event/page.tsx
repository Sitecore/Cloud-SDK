'use client';

import { BrowserSettings, init, sendWidgetSuggestionClickEvent } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function SendWidgetSuggestionClickEvent() {
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

  const [sendWidgetSuggestionClickEventData, setSendWidgetSuggestionClickEventData] = useState(
    '{"channel":"WEB","currency":"EUR","filters":[{"displayName":"test","name":"test","title":"test","value":"test","valuePosition":1}],"language":"EN","page":"test","pathname":"https://www.sitecore.com/products/content-cloud","request":{"advancedQueryText":"test1","keyword":"test_keyword","modifiedKeyword":"test2","numRequested":20,"numResults":10,"pageNumber":2,"pageSize":1,"redirectUrl":"test3","totalResults":10},"widgetIdentifier":"12345"}'
  );

  return (
    <div>
      <h1>Send widget suggestion click event</h1>
      Send widget suggestion click event data:
      <textarea
        style={{ width: '1000px' }}
        value={sendWidgetSuggestionClickEventData}
        onChange={(e) => setSendWidgetSuggestionClickEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='sendWidgetSuggestionClickEvent'
        onClick={() => sendWidgetSuggestionClickEvent(JSON.parse(sendWidgetSuggestionClickEventData))}>
        Send widget suggestion click event
      </button>
      <br />
    </div>
  );
}
