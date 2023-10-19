// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useRef, useState } from 'react';
import { useEvents } from '../context/events';
import { usePersonalize } from '../context/personalize';
import { init } from '@sitecore-cloudsdk/personalize';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';

export function FallBackPointOfSale() {
  const responseRef = useRef<HTMLInputElement | null>(null);
  const [updatedPointOfSale, setupdatedPointOfSale] = useState('');
  const events = useEvents();
  const personalize = usePersonalize();

  const sendApiCustomEventWithPointOfSale = () => {
    fetch(`/api/custom-event?pointOfSale=spinair.com`);
  };

  const sendApiCustomEventWithPointOfSaleFromSettings = () => {
    fetch(`/api/custom-event?pointOfSaleFromSettings=spinair.com`);
  };

  const sendApiCustomEventWithoutPointOfSale = () => {
    fetch(`/api/custom-event`);
  };

  const eventWithPos = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    pointOfSale: 'spinair.com',
  };

  const eventWithoutPos = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
  };

  function sendCustomEventWithPointOfSale() {
    events?.event('CUSTOM', eventWithPos);
  }

  function sendCustomEventWithoutPointOfSale() {
    events?.event('CUSTOM', eventWithoutPos);
  }

  function sendEventWithUpdatedPosSetting(event: typeof eventWithoutPos | typeof eventWithPos) {
    events?.updatePointOfSale(updatedPointOfSale);

    events?.event('CUSTOM', event);
  }

  /* -- Personalize --*/
  async function callPersonalizeWithPointOfSale() {
    const data = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test2@tst.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: 'spinair.com',
    };
    await personalize?.personalize(data);
    const res = await personalize?.personalize(data);

    if (responseRef.current) {
      responseRef.current.value = res ? JSON.stringify(res) : '';
    }
  }
  async function callPersonalizeWithoutPointOfSale() {
    const localPersonalize = await init({
      clientKey: process.env.CLIENT_KEY || '',
      contextId: 'N/A',
      siteId: 'N/A',
    });
    const data = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test2@tst.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };
    const res = await localPersonalize?.personalize(data);

    if (responseRef.current) {
      responseRef.current.value = res ? JSON.stringify(res) : '';
    }
  }

  async function callPersonalizeWithoutPointOfSaleWithFallback() {
    const localPersonalize = await init({
      clientKey: process.env.CLIENT_KEY || '',
      contextId: 'N/A',
      siteId: 'N/A',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pointOfSale: getSettingFromUrlParams('pointOfSaleFromSettings')!,
    });
    const data = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'test2@tst.com',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };
    const res = await localPersonalize?.personalize(data);

    if (responseRef.current) {
      responseRef.current.value = res ? JSON.stringify(res) : '';
    }
  }

  return (
    <div>
      <h1 data-testid='customEventPageTitle'>PointOfSale Settings Fallback</h1>
      <div>
        {/*-- Custom events --*/}
        <h2>Custom events</h2>
        <label htmlFor='updatePointOfSaleInput'> update pointOfSale setting:</label>
        <input
          type='text'
          id='updatePointOfSaleInput'
          data-testid='updatePointOfSaleInput'
          name='updatePointOfSaleInput'
          value={updatedPointOfSale}
          onChange={(e) => setupdatedPointOfSale(e.target.value)}
        />
        <button
          data-testid='sendCustomEventWithoutPointOfSale'
          onClick={sendCustomEventWithoutPointOfSale}>
          Send custom event without pointOfSale
        </button>
        <button
          data-testid='sendCustomEventWithPointOfSale'
          onClick={sendCustomEventWithPointOfSale}>
          Send custom event with pointOfSale
        </button>
        <button
          data-testid='sendEventFromServerWithPointOfSale'
          onClick={sendApiCustomEventWithPointOfSale}>
          Send Event from server with pointOfSale
        </button>
        <button
          data-testid='sendEventFromServerWithPointOfSaleFromSettings'
          onClick={sendApiCustomEventWithPointOfSaleFromSettings}>
          Send Event from server with pointOfSale from settings
        </button>
        <button
          data-testid='sendEventFromServerWithoutPointOfSale'
          onClick={sendApiCustomEventWithoutPointOfSale}>
          Send Event from server without pointOfSale
        </button>
        <button
          data-testid='sendEventWithPosAndUpdatedPosSetting'
          onClick={async () => {
            sendEventWithUpdatedPosSetting(eventWithPos);
          }}>
          Send Event with updated PointOfSale from Settings and PointOfSale defined in event
        </button>
        <button
          data-testid='sendEventWithUpdatedPosSetting'
          onClick={async () => {
            sendEventWithUpdatedPosSetting(eventWithoutPos);
          }}>
          Send Eve Send Event with updated PointOfSale
        </button>
        {/*-- Personalize --*/}
        <h2>Personalize</h2>
        <button
          data-testid='callPersonalizeWithoutPointOfSale'
          onClick={callPersonalizeWithoutPointOfSale}>
          Call personalize without pointOfSale
        </button>
        <button
          data-testid='callPersonalizeWithoutPointOfSaleWithFallback'
          onClick={callPersonalizeWithoutPointOfSaleWithFallback}>
          Call personalize without pointOfSale with fallback
        </button>
        <button
          data-testid='callPersonalizeWithPointOfSale'
          onClick={callPersonalizeWithPointOfSale}>
          Call personalize with pointOfSale
        </button>
        Response:{' '}
        <input
          ref={responseRef}
          type='text'
          data-testid='response'
          id='response'
          readOnly
        />
      </div>
    </div>
  );
}

export default FallBackPointOfSale;
