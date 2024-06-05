import { init, pageView } from '@sitecore-cloudsdk/events/browser';
import { init as initServer, pageView as pageViewServer } from '@sitecore-cloudsdk/events/server';
import { useEffect, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import type { PageViewData } from '@sitecore-cloudsdk/events/browser';
import { capturedDebugLogs } from '../utils/debugLogs';
import { getCookie } from '@sitecore-cloudsdk/utils';

interface ViewEventProps {
  res: string | number | readonly string[];
  debugLogs: string;
}

export default function ViewEvent({ res, debugLogs }: ViewEventProps) {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const eventAttributes = new URLSearchParams(window.location.search);
    const includeUTMSearchParameter = eventAttributes.get('includeUTMParameters');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const extensionDataNested = eventAttributes.has('nested') ? JSON.parse(eventAttributes.get('nested')!) : {};
    const noExt = eventAttributes.get('no-ext') === 'true';

    const eventData: PageViewData = {};

    if (eventAttributes.get('variantid')) eventData.pageVariantId = eventAttributes.get('variantid') || '';

    if (typeof includeUTMSearchParameter === 'string')
      if (includeUTMSearchParameter === 'true') eventData.includeUTMParameters = true;
      else if (includeUTMSearchParameter === 'false') eventData.includeUTMParameters = false;

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
        siteName: process.env.SITE_ID || ''
      });

      if (!noExt) eventData.extensionData = extensionData;

      pageView(eventData);
    }

    initEventsSetting();
  }, []);

  const sendPageViewEventWithoutChannelAndCurencyFromMiddleware = async () => {
    await fetch('/middleware-view-event');

    const cookie = getCookie(document?.cookie, 'ViewEventRequestCookie');
    setResponse(decodeURIComponent(cookie?.value || ''));
  };

  if (res === 'Error')
    throw new Error(`[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.`);

  const sendPageViewEventWithChannelAndCurreny = () => {
    const eventData: PageViewData = {
      channel: 'WEB',
      currency: 'EUR'
    };

    pageView(eventData);
  };

  const sendPageViewEventWithoutParams = () => {
    pageView();
  };

  const sendPageViewEventWithoutParamsFromMiddleware = async () => {
    await fetch('/middleware-view-event-without-params');

    const cookie = getCookie(document?.cookie, 'ViewEventRequestCookie');
    setResponse(decodeURIComponent(cookie?.value || ''));
  };

  return (
    <>
      <div>
        <h1 data-testid='viewEventPageTitle'>View Event Page</h1>
      </div>
      <button
        type='button'
        data-testid='sendPageViewEventWithChannelAndCurreny'
        onClick={sendPageViewEventWithChannelAndCurreny}>
        Send Event With Channel And Currency Params
      </button>
      <button
        type='button'
        data-testid='sendPageViewEventWithoutChannelAndCurencyFromMiddleware'
        onClick={sendPageViewEventWithoutChannelAndCurencyFromMiddleware}>
        Send Event From Middleware Without Channel And Currency Params
      </button>
      <button
        type='button'
        data-testid='sendPageViewEventWithoutParams'
        onClick={sendPageViewEventWithoutParams}>
        Send PageView Event Without Params
      </button>
      <button
        type='button'
        data-testid='sendPageViewEventWithoutParamsFromMiddleware'
        onClick={sendPageViewEventWithoutParamsFromMiddleware}>
        Send PageView Event Without Params from Middleware
      </button>

      <div>
        <label htmlFor='response'>response</label>
        <input
          type='text'
          id='response'
          data-testid='response'
          name='response'
          defaultValue={res}
          value={response}
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

  const eventData: Record<string, unknown> = {
    channel: 'WEB',
    currency: 'EUR'
  };

  if (eventAttributes.get('variantid')) eventData['variantid'] = eventAttributes.get('variantid');

  const extensionDataExt: Record<string, unknown> = {};
  eventAttributes.forEach((value, key) => {
    extensionDataExt[key as keyof typeof extensionDataExt] = value;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extensionData: any = {};
  if (extensionDataNested && Object.keys(extensionDataNested).length) extensionData.nested = { ...extensionDataNested };

  if (Object.keys(extensionDataExt).length) Object.assign(extensionData, extensionDataExt);

  await initServer(context.req, context.res, {
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    enableServerCookie:
      typeof context.query.enableServerCookie === 'string' && context.query.enableServerCookie.toLowerCase() === 'true',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    siteName: process.env.SITE_ID || ''
  });

  if (!noExt) eventData.extensionData = extensionData;

  let EPResponse;
  try {
    EPResponse = await pageViewServer(context.req, eventData as unknown as PageViewData);
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      debugLogs: JSON.stringify(capturedDebugLogs),
      res: JSON.stringify(EPResponse)
    }
  };
}
