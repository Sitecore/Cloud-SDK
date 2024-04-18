// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { PageViewData } from '@sitecore-cloudsdk/events/server';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import { useState } from 'react';

export default function About() {
  const [eventData, seteventData] = useState<PageViewData>({
    channel: 'WEB',
    currency: 'EUR'
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
