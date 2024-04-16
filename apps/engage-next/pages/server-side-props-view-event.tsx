// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { init, pageView } from '@sitecore-cloudsdk/events/server';
import { GetServerSidePropsContext } from 'next';

export default function serverSidePropsViewEvent() {
  return (
    <div>
      <h1 data-testid='serverSidePropsViewEventPageTitle'>ServerSideProps Pageview event page</h1>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const eventData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'serverSideProps-view'
  };

  const timeout =
    typeof context.query.timeout === 'string' && context.query.timeout ? +context.query.timeout : undefined;

  await init(context.req, context.res, {
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
    timeout: timeout
  });

  let EPResponse;

  try {
    EPResponse = await pageView(context.req, eventData);
  } catch {
    EPResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(EPResponse)
    }
  };
}
