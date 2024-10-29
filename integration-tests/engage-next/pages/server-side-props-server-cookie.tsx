import type { GetServerSidePropsContext } from 'next';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import '@sitecore-cloudsdk/events/server';

export default function serverSidePropsServerCookie() {
  return (
    <div>
      <h1 data-testid='serverSidePropsServerCookiePageTitle'>ServerSideProps Server Cookie page ###1###</h1>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const timeout =
    typeof context.query.timeout === 'string' && context.query.timeout ? +context.query.timeout : undefined;

  await CloudSDK(context.req, context.res, {
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
    timeout: timeout
  })
    .addEvents()
    .initialize();

  return {
    props: {}
  };
}
