// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer } from '@sitecore-cloudsdk/events';
import { GetServerSidePropsContext } from 'next';

export function serverSidePropsViewEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsViewEventPageTitle'>ServerSideProps Pageview event page</h1>
    </div>
  );
}

export default serverSidePropsViewEvent;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const event = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'serverSideProps-view',
    pointOfSale: 'spinair.com',
  };

  const timeout =
    typeof context.query.timeout === 'string' && context.query.timeout ? +context.query.timeout : undefined;
  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    enableServerCookie: true,
    contextId: 'N/A',
    siteId: 'N/A',
  });

  await eventsServer.handleCookie(context.req, context.res, timeout);

  let cdpResponse;
  if (eventsServer) {
    try {
      cdpResponse = await eventsServer.pageView(event, context.req);
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
