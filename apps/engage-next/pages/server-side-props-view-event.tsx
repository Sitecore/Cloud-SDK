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

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    forceServerCookieMode: true,
    targetURL: `https://${process.env.TARGET_URL}`,
  });

  const timeout = context.query.timeout;
  await eventsServer.handleCookie(
    context.req,
    context.res,
    typeof timeout === 'string' ? parseInt(timeout) : undefined
  );

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
