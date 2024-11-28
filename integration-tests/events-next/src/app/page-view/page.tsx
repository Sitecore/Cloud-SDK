'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { pageView, PageViewData } from '@sitecore-cloudsdk/events/browser';

export default function Page() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: process.env.SITE_NAME as string,
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .initialize();
  }, []);

  const [pageViewDataInput, setPageViewDataInput] = useState('');

  const sendPageView = async () => {
    const pageViewData: PageViewData = JSON.parse(pageViewDataInput);
    await pageView(pageViewData);
  };

  return (
    <div>
      <h2>pageView event</h2>
      <textarea
        style={{ width: '1000px' }}
        value={pageViewDataInput}
        onChange={(e) => setPageViewDataInput(e.target.value)}
        data-testid='pageViewDataInput'
        rows={4}
        cols={40}
      />
      <br />
      <button
        data-testid='sendPageView'
        onClick={sendPageView}>
        Send pageView event
      </button>
    </div>
  );
}
