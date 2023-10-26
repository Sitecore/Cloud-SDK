// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useEvents } from '../context/events';
import { usePersonalize } from '../context/personalize';

import { useState } from 'react';
import styles from './HomePage.module.css';
import { IPageViewEventInput } from '@sitecore-cloudsdk/events';

export function Index() {
  const events = useEvents();
  const personalize = usePersonalize();

  const [eventData, seteventData] = useState<IPageViewEventInput>({
    channel: 'WEB',
    currency: 'EUR'
  });
  const [bid, setBID] = useState('Click a button above to retrieve browser ID');
  const [version, setVersion] = useState('Click a button above to retrieve version');

  const sendRequestToNextApi = async () => {
    const serverData = eventData;

    const queryString = Object.keys(serverData)
      .map((key) => key + '=' + serverData[key as keyof typeof serverData])
      .join('&');

    const response = await fetch(
      `/api/pageview-event${window.location.search ? window.location.search + '&' : '?'}${queryString}`
    );
    const data = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = JSON.stringify(data);
  };

  return (
    <div>
      <h1 data-testid='homePageTitle'>Home</h1>
      <div className='flex'>
        <fieldset>
          <legend>Events</legend>
          <div>
            <h3>Current event</h3>
            {Object.entries(eventData).map(([key, value]) => (
              <p key={key}>
                {key}: <span>{value.toString()}</span>
              </p>
            ))}
          </div>
          <div>
            <label htmlFor='page_param'>Page param </label>
            <input
              type='text'
              id='page_param'
              data-testid='pageParamInput'
              onChange={(e) => seteventData((prev) => ({ ...prev, page: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor='page_param'>Language param </label>
            <input
              type='text'
              id='language_param'
              data-testid='languageParamInput'
              onChange={(e) => seteventData((prev) => ({ ...prev, language: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor='page_param'>Variant id param </label>
            <input
              type='text'
              id='variantid_param'
              data-testid='variantidParamInput'
              onChange={(e) => seteventData((prev) => ({ ...prev, pageVariantId: e.target.value }))}
            />
          </div>
          <div>
            <button
              data-testid='sendEvent'
              onClick={() => events?.pageView(eventData)}>
              Send Event
            </button>
          </div>
          <div>
            <button
              data-testid='sendEventFromServer'
              onClick={sendRequestToNextApi}>
              Send Page View Event from Server
            </button>
            <div>
              <label htmlFor='response'>response</label>
              <input
                type='text'
                id='response'
                data-testid='response'
                name='response'
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Retrieve Browser ID</legend>
          <button
            className={styles.button}
            data-testid='getBrowserIdFromWindow'
            onClick={() => setBID(events?.getBrowserId() || '')}>
            Get ID invoking method from window
          </button>
          <button
            className={styles.button}
            data-testid='getBrowserIdFromEngage'
            onClick={() => {
              if (window.Engage.getBrowserId !== undefined) setBID(window.Engage.getBrowserId());
            }}>
            Get ID invoking method from Engage library
          </button>
          <h3>Browser id is</h3>
          <span
            id='display_id'
            data-testid='browserIdLabel'>
            {bid}
          </span>
        </fieldset>
        <fieldset>
          <legend>Retrieve Events Library Version</legend>
          <button
            className={styles.button}
            data-testid='getVersionLibFromWindowEvents'
            onClick={() => events && setVersion(events.version)}>
            Get Events version from lib function
          </button>
          <button
            className={styles.button}
            data-testid='getVersionLibFromEvents'
            onClick={() => {
              if (window.Engage.versions?.events !== undefined) setVersion(window.Engage.versions.events);
            }}>
            Get Events version from window
          </button>
          <legend>Retrieve Personalize Library Version</legend>
          <button
            className={styles.button}
            data-testid='getVersionLibFromWindowPersonalize'
            onClick={() => personalize && setVersion(personalize.version)}>
            Get Personalize version from lib function
          </button>
          <button
            className={styles.button}
            data-testid='getVersionLibFromPersonalize'
            onClick={() => {
              if (window.Engage.versions?.personalize !== undefined) setVersion(window.Engage.versions.personalize);
            }}>
            Get Personalize version from window
          </button>
          <h3>Version id is</h3>
          <span
            id='display_version_id'
            data-testid='versionLabel'>
            {version}
          </span>
        </fieldset>
      </div>
    </div>
  );
}

export default Index;
