import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';
import type { GetServerSidePropsContext } from 'next';

export default function ServerSidePropsCustomEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsCustomEventPageTitle'>ServerSideProps Custom event page</h1>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'serverSideProps-custom'
  };

  await CloudSDK(context.req, context.res, {
    cookieDomain: typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toString() : 'localhost',
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    enableServerCookie: true,
    siteName: process.env.SITE_ID || ''
  })
    .addEvents()
    .initialize();

  let EPResponse;
  try {
    EPResponse = await event(context.req, { ...eventData, type: 'SERVERSIDEPROPS_CUSTOM' });
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(EPResponse)
    }
  };
}
