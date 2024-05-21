'use client';

import type { BrowserSettings } from '@sitecore-cloudsdk/search-api-client/browser';
import { init } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect } from 'react';

interface InitProps {
  enableBrowserCookie: boolean;
}

export default function Init({ enableBrowserCookie }: InitProps) {
  useEffect(() => {
    const settings: BrowserSettings = {
      enableBrowserCookie,
      siteName: 'TestSite',
      userId: 'user123',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    };
    async function initSearch() {
      await init(settings);
    }
    initSearch();
  }, []);

  return (
    <div style={{ border: '2px solid black', padding: 16, margin: 16, display: 'inline-block' }}>
      <h1>
        <span>
          {' '}
          search-api-client <code>init()</code> with{' '}
          <code>enableBrowserCookie={JSON.stringify(enableBrowserCookie)}</code>
        </span>
      </h1>
    </div>
  );
}
