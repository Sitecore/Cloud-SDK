'use client';

import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { entityView } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect, useState } from 'react';

export default function EntityViewEvent() {
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

  const [entityViewEventData, setEntityViewEventData] = useState(
    '{"currency":"EUR","language":"EN","page":"test","entity":{"attributes":{"author":"ABC"},"entity":"category","entityType":"subcat","id":"123","sourceId":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"},"pathname":"https://www.sitecore.com/products/content-cloud"}'
  );

  return (
    <div>
      <h1>Send conversion event</h1>
      Conversion event data:
      <textarea
        style={{ width: '1000px' }}
        value={entityViewEventData}
        onChange={(e) => setEntityViewEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='entityView'
        onClick={() => entityView(JSON.parse(entityViewEventData))}>
        Send entity view event
      </button>
      <br />
    </div>
  );
}
