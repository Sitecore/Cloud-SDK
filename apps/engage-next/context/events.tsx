// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { init } from '@sitecore-cloudsdk/events';
import type { Events } from '@sitecore-cloudsdk/events';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';

// eslint-disable-next-line @typescript-eslint/naming-convention
const EventsContext = createContext<Events | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EventsProvider = ({ children }: { children: ReactNode }) => {
  /* eslint-enable @typescript-eslint/naming-convention */
  const [events, setEvents] = useState<Events>();

  const loadEvents = useCallback(async () => {
    // eslint-disable-next-line max-len, prefer-const
    const temp = await init({
      clientKey: process.env.CLIENT_KEY || '',
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      forceServerCookieMode: getSettingFromUrlParams('forceServerCookieMode') === 'true',
      includeUTMParameters: getSettingFromUrlParams('includeUTMParameters') === 'true',
      pointOfSale: getSettingFromUrlParams('pointOfSaleFromSettings') || undefined,
      targetURL: getSettingFromUrlParams('targetURL') ?? `https://${process.env.TARGET_URL}`,
    });
    window.eventsTestingInstance = temp;
    window.events = temp;
    window.includeUTMParameters = getSettingFromUrlParams('includeUTMParameters') === 'true';
    setEvents(temp);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return <EventsContext.Provider value={events}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const events = useContext(EventsContext);
  return events;
};
