// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { identity, init } from '@sitecore-cloudsdk/events/server';
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
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'testServerSideProps@test.com',
    identifiers: [{ id: 'testServerSideProps@test.com', provider: 'email' }],
  };

  await init(
    {
      cookieDomain:
        typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
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
    cdpResponse = await identity(eventData, context.req);
  } catch {
    cdpResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(cdpResponse),
    },
  };
}
