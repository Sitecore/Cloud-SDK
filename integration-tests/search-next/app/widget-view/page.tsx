'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { widgetView } from '@sitecore-cloudsdk/search/browser';

export default function WidgetView() {
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

  const [widgetViewEventData, setWidgetViewEventData] = useState(
    `{
      "channel": "WEB",
        "currency": "EUR",
        "entities": [{
            "attributes": {
                "author": "ABC"
            },
            "entityType": "subcat1",
            "entity": "category1",
            "id": "123",
            "sourceId": "534",
            "uri": "https://www.sitecore.com/products/content-cloud3333333"
        },{
            "attributes": {
                "author": "XYZ"
            },
            "entityType": "subcat2",
            "entity": "category2",
            "id": "678",
            "sourceId": "910",
            "uri": "https://www.sitecore.com/products/content-cloud4444444"
        }], 
        "language": "EN",
        "page": "test",
        "pathname": "https://www.sitecore.com/products/content-cloud",
        "request": {
            "advancedQueryText": "test1",
            "keyword": "test_keyword",
            "modifiedKeyword": "test2",
            "numRequested": 20,
            "numResults": 10,
            "pageNumber": 2,
            "pageSize": 1,
            "redirectUrl": "test3",
            "totalResults": 10
        },
        "widgetId": "12345"
    }`
  );

  return (
    <div>
      <h1>Send widget view event</h1>
      Send widget view event data:
      <textarea
        style={{ width: '1000px' }}
        value={widgetViewEventData}
        onChange={(e) => setWidgetViewEventData(e.target.value)}
        data-testid='eventInputData'
        rows={4}
        cols={40}
      />
      <br />
      <button
        type='button'
        data-testid='widgetView'
        onClick={() => widgetView(JSON.parse(widgetViewEventData))}>
        Send widget click event
      </button>
      <br />
    </div>
  );
}
