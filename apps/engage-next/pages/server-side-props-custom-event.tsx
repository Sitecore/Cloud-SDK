// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { eventServer, initServer } from '@sitecore-cloudsdk/events';
import { GetServerSidePropsContext } from 'next';

export function ServerSidePropsCustomEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsCustomEventPageTitle'>ServerSideProps Custom event page</h1>
    </div>
  );
}

export default ServerSidePropsCustomEvent;

// getServerSideProps params interface

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const event = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'serverSideProps-custom',
  };

  await initServer(
    {
      cookieDomain:
        typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toString() : 'localhost',
      cookieExpiryDays: 400,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      enableServerCookie: true,
      siteName: process.env.SITE_ID || '',
    },
    context.req,
    context.res
  );

  let cdpResponse;
  try {
    cdpResponse = await eventServer('SERVERSIDEPROPS_CUSTOM', event, context.req);
  } catch {
    cdpResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(cdpResponse),
    },
  };
}
