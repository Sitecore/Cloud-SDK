'use client';

import { BrowserSettings, init, sendConversionEvent } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function SendConversionEvent() {
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

  const [sendConversionEventData, setSendConversionEventData] = useState(
    '{"currency":"EUR","language":"EN","page":"test","entity":{"attributes":{"author":"ABC"},"entity":"category","entityType":"subcat","id":"123","sourceId":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"},"pathname":"https://www.sitecore.com/products/content-cloud"}'
  );

  return (
    <div>
      <h1>Send conversion event</h1>
      Conversion event data:
      <textarea
        style={{ width: '1000px' }}
        value={sendConversionEventData}
        onChange={(e) => setSendConversionEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='sendConversionEvent'
        onClick={() => sendConversionEvent(JSON.parse(sendConversionEventData))}>
        Send conversion event
      </button>
      <br />
    </div>
  );
}
