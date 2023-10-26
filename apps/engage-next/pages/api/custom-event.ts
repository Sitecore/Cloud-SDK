// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, ICustomEventInput } from '@sitecore-cloudsdk/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: ICustomEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-custom',
  };

  const eventsServer = await initServer({
    cookieExpiryDays: 400,
    enableServerCookie: true,
    contextId: process.env.CONTEXT_ID || '',
    siteId: process.env.SITE_ID || '',
  });

  const cdpResponse = await eventsServer.event('CUSTOM', event, req);
  res.status(200).json(cdpResponse);
}
