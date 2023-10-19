// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer } from '@sitecore-cloudsdk/events';
import { GetServerSidePropsContext } from 'next';

export function ServerSidePropsIdenityEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsIdentityEventPageTitle'>ServerSideProps Identity event page</h1>
    </div>
  );
}

export default ServerSidePropsIdenityEvent;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const event = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'testServerSideProps@test.com',
    identifiers: [{ id: 'testServerSideProps@test.com', provider: 'email' }],
    language: 'EN',
    pointOfSale: 'spinair.com',
  };

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    enableServerCookie: true,
    contextId: 'N/A',
    siteId: 'N/A',
  });

  await eventsServer.handleCookie(context.req, context.res);

  let cdpResponse;
  if (eventsServer) {
    try {
      cdpResponse = await eventsServer.identity(event, context.req);
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
