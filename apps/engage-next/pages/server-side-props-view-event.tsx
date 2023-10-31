// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { handleServerCookie } from '@sitecore-cloudsdk/core';
import { initServer, pageViewServer } from '@sitecore-cloudsdk/events';
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
    page: 'serverSideProps-view',
  };

  const timeout =
    typeof context.query.timeout === 'string' && context.query.timeout ? +context.query.timeout : undefined;
  await initServer(
    {
      cookieDomain:
        typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
      cookieExpiryDays: 400,
      contextId: process.env.CONTEXT_ID || '',
      enableServerCookie: true,
      siteId: process.env.SITE_ID || '',
    },
    context.req,
    context.res
  );

  let cdpResponse;

  await handleServerCookie(context.req, context.res, timeout);
  try {
    cdpResponse = await pageViewServer(event, context.req);
  } catch {
    cdpResponse = 'Error';
  }

  return {
    props: {
      res: JSON.stringify(cdpResponse),
    },
  };
}
