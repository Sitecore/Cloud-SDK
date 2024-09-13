import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { identity } from '@sitecore-cloudsdk/events/server';
import type { GetServerSidePropsContext } from 'next';

export default function ServerSidePropsIdenityEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsIdentityEventPageTitle'>ServerSideProps Identity event page</h1>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'testServerSideProps@test.com',
    identifiers: [{ id: 'testServerSideProps@test.com', provider: 'email' }]
  };

  await CloudSDK(context.req, context.res, {
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    enableServerCookie: true,
    siteName: process.env.SITE_ID || ''
  })
    .addEvents()
    .initialize();

  let EPResponse;
  try {
    EPResponse = await identity(context.req, eventData);
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(EPResponse)
    }
  };
}
