// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer, IPageViewEventInput, pageView } from '@sitecore-cloudsdk/events';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { handleServerCookie } from '@sitecore-cloudsdk/core';

export function About() {
  const [eventData, seteventData] = useState<IPageViewEventInput>({
    channel: 'WEB',
    currency: 'EUR',
  });
  return (
    <div>
      <h1>About Page</h1>
      <fieldset>
        <legend>Events</legend>
        <div>
          <label htmlFor='page_param'>Page param </label>
          <input
            type='text'
            id='page_param'
            data-testid='pageParamInput'
            onChange={(e) => seteventData((prev) => ({ ...prev, page: e.target.value }))}
          />
          <button
            data-testid='sendEvent'
            onClick={() => pageView(eventData)}>
            Send Event
          </button>
        </div>
      </fieldset>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookieDomain =
    typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : undefined;

  await initServer(
    {
      cookieDomain,
      cookieExpiryDays: 400,
      enableServerCookie:
        typeof context.query.enableServerCookie === 'string' &&
        context.query.enableServerCookie.toLowerCase() === 'true',

      contextId: process.env.CONTEXT_ID || '',
      siteId: process.env.SITE_ID || '',
    },
    context.req,
    context.res
  );

  if (typeof context.query.enableServerCookie === 'string' && context.query.enableServerCookie.toLowerCase() === 'true')
    await handleServerCookie(context.req, context.res);

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default About;
