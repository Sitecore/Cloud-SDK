// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init } from '@sitecore-cloudsdk/events/server';
import { GetServerSidePropsContext } from 'next';

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
    page: 'serverSideProps-custom',
  };

  await init(context.req, context.res, {
    cookieDomain: typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toString() : 'localhost',
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
  });

  let EPResponse;
  try {
    EPResponse = await event(context.req, { ...eventData, type: 'SERVERSIDEPROPS_CUSTOM' });
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(EPResponse),
    },
  };
}
