// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer, IPageViewEventInput } from '@sitecore-cloudsdk/events';
import { useEvents } from '../context/events';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
export function About() {
  const events = useEvents();

  const [eventData, seteventData] = useState<IPageViewEventInput>({
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    pointOfSale: 'spinair.com',
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
            onClick={() => events?.pageView(eventData)}>
            Send Event
          </button>
        </div>
      </fieldset>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieDomain:
      typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
    cookieExpiryDays: 400,
    forceServerCookieMode:
      typeof context.query.forceServerCookieMode === 'string' &&
      context.query.forceServerCookieMode.toLowerCase() === 'true',
    targetURL: `https://${process.env.TARGET_URL}`,
  });

  await eventsServer.handleCookie(context.req, context.res);
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default About;
