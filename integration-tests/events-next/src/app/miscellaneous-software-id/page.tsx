'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { event } from '@sitecore-cloudsdk/events/browser';
import { decorateAll, resetAll } from '../../e2e-decorators/decorate-all';

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

  const sendEventFromBrowserWithSoftwareID = async () => {
    decorateAll('sendEventFromBrowserWithSoftwareID');
    await event({ type: 'CUSTOM' });
    resetAll();
  };

  return (
    <div>
      <div>
        <h2>miscellaneous software-id</h2>
        <button
          type='button'
          data-testid='sendEventFromBrowserWithSoftwareID'
          onClick={sendEventFromBrowserWithSoftwareID}>
          Request Event From Browser With Software ID
        </button>
      </div>
    </div>
  );
}
