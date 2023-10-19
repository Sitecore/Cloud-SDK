// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer } from '@sitecore-cloudsdk/events';
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
    language: 'EN',
    page: 'serverSideProps-custom',
    pointOfSale: 'spinair.com',
  };

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieDomain: typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toString() : 'localhost',
    cookieExpiryDays: 400,
    enableServerCookie: true,
    contextId: 'N/A',
    siteId: 'N/A',
  });

  await eventsServer.handleCookie(context.req, context.res);

  let cdpResponse;
  if (eventsServer) {
    try {
      cdpResponse = await eventsServer.event('SERVERSIDEPROPS_CUSTOM', event, context.req);
    } catch {
      cdpResponse = 'Error';
    }
  }

  return {
    props: {
      res: JSON.stringify(cdpResponse),
    },
  };
}
