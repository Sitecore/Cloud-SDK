'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { event, form, identity, pageView } from '@sitecore-cloudsdk/events/browser';
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

  const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

  const sendCustomEventFromBrowserWithRequestedAt = async () => {
    decorateAll('sendCustomEventFromBrowserWithRequestedAt');
    await event({
      ...baseEventData,
      type: 'CUSTOM_EVENT'
    });
    resetAll();
  };
  const sendPageViewEventFromBrowserWithRequestedAt = async () => {
    decorateAll('sendPageViewEventFromBrowserWithRequestedAt');
    await pageView(baseEventData);
    resetAll();
  };

  const sendIdentityEventFromBrowserWithRequestedAt = async () => {
    decorateAll('sendIdentityEventFromBrowserWithRequestedAt');
    await identity({
      ...baseEventData,
      email: 'test@test.com',
      identifiers: [{ id: '', provider: 'email' }]
    });
    resetAll();
  };
  const sendFormEventFromBrowserWithRequestedAt = async () => {
    decorateAll('sendFormEventFromBrowserWithRequestedAt');
    await form('test_id', 'VIEWED', 'test');
    resetAll();
  };

  return (
    <div>
      <div>
        <h2>miscellaneous requested-at</h2>
        <button
          type='button'
          data-testid='sendCustomEventFromBrowserWithRequestedAt'
          onClick={sendCustomEventFromBrowserWithRequestedAt}>
          Send CustomEvent From Browser With requested_at
        </button>
        <br />
        <button
          type='button'
          data-testid='sendPageViewEventFromBrowserWithRequestedAt'
          onClick={sendPageViewEventFromBrowserWithRequestedAt}>
          Send PageView From Browser With requested_at
        </button>
        <br />
        <button
          type='button'
          data-testid='sendIdentityEventFromBrowserWithRequestedAt'
          onClick={sendIdentityEventFromBrowserWithRequestedAt}>
          Send Identity From Browser With requested_at
        </button>
        <br />
        <button
          type='button'
          data-testid='sendFormEventFromBrowserWithRequestedAt'
          onClick={sendFormEventFromBrowserWithRequestedAt}>
          Send Form Event With requested_at
        </button>
      </div>
    </div>
  );
}
