// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { useEffect } from 'react';
import { PageViewEventInput, pageView, init } from '@sitecore-cloudsdk/events/browser';
import { init as initServer, pageView as pageViewServer } from '@sitecore-cloudsdk/events/server';
import { NestedObject } from '@sitecore-cloudsdk/utils';
import { GetServerSidePropsContext } from 'next';
import { capturedDebugLogs } from '../utils/debugLogs';

interface ViewEventProps {
  res: string | number | readonly string[]
  debugLogs: string
}

export default function ViewEvent({ res, debugLogs}: ViewEventProps) {
  useEffect(() => {
    const eventAttributes = new URLSearchParams(window.location.search);
    const includeUTMSearchParameter = eventAttributes.get('includeUTMParameters');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const extensionDataNested = eventAttributes.has('nested') ? JSON.parse(eventAttributes.get('nested')!) : {};
    const noExt = eventAttributes.get('no-ext') === 'true';

    const event: PageViewEventInput = {
      channel: 'WEB',
      currency: 'EUR',
    };

    if (eventAttributes.get('variantid')) {
      event.pageVariantId = eventAttributes.get('variantid') || '';
    }

    if (typeof includeUTMSearchParameter === 'string') {
      if (includeUTMSearchParameter === 'true') event.includeUTMParameters = true;
      else if (includeUTMSearchParameter === 'false') event.includeUTMParameters = false;
    }

    eventAttributes.delete('nested');
    eventAttributes.delete('variantid');
    eventAttributes.delete('includeUTMParameters');

    const extensionDataExt: Record<string, unknown> = {};

    eventAttributes.forEach((value, key) => {
      extensionDataExt[key as keyof typeof extensionDataExt] = value;
    });

    const extensionData: NestedObject = {};
    if (extensionDataNested && Object.keys(extensionDataNested).length)
      extensionData.nested = { ...extensionDataNested };

    if (Object.keys(extensionDataExt).length) Object.assign(extensionData, extensionDataExt);

    async function initEventsSetting() {
      await init({
        cookieDomain: 'localhost',
        cookieExpiryDays: 400,
        enableBrowserCookie: true,
        sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
        siteName: process.env.SITE_ID || '',
      });

      pageView(event, noExt ? undefined : extensionData);
    }

    initEventsSetting();
  }, []);

  if (res === 'Error') {
    throw new Error(`[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.`);
  }

  return (
    <>
      <div>
        <h1 data-testid='viewEventPageTitle'>View Event Page</h1>
      </div>
      <div>
        <label htmlFor='response'>response</label>
        <input
          type='text'
          id='response'
          data-testid='response'
          name='response'
          defaultValue={res}
        />
      </div>
      <div>
        <label htmlFor='debug'>Debug:</label>
        <textarea
          style={{ color: 'black' }}
          id='debug'
          data-testid='debug'
          name='debug'
          value={debugLogs ? JSON.stringify(debugLogs) : ''}
          rows={4}
          cols={50}></textarea>
        <input />
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const requestUrl = new URL(context.req.url || '', `https://${context.req.headers.host}`);
  const eventAttributes = new URLSearchParams(requestUrl.search);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const extensionDataNested = eventAttributes.get('nested') ? JSON.parse(eventAttributes.get('nested')!) : {};
  const noExt = eventAttributes.get('no-ext') === 'true';

  const event: Record<string, unknown> = {
    channel: 'WEB',
    currency: 'EUR',
  };

  if (eventAttributes.get('variantid')) {
    event['variantid'] = eventAttributes.get('variantid');
  }

  const extensionDataExt: Record<string, unknown> = {};
  eventAttributes.forEach((value, key) => {
    extensionDataExt[key as keyof typeof extensionDataExt] = value;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extensionData: any = {};
  if (extensionDataNested && Object.keys(extensionDataNested).length) extensionData.nested = { ...extensionDataNested };

  if (Object.keys(extensionDataExt).length) Object.assign(extensionData, extensionDataExt);

  await initServer(
    {
      cookieDomain:
        typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
      cookieExpiryDays: 400,
      enableServerCookie:
        typeof context.query.enableServerCookie === 'string' &&
        context.query.enableServerCookie.toLowerCase() === 'true',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    },
    context.req,
    context.res
  );

  let EPResponse;
  try {
    EPResponse = await pageViewServer(
      event as unknown as PageViewEventInput,
      context.req,
      noExt ? undefined : extensionData
    );
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      debugLogs: JSON.stringify(capturedDebugLogs),
      res: JSON.stringify(EPResponse),
    },
  };
}
