// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NextApiRequest, NextApiResponse } from 'next';
import { event, init } from '@sitecore-cloudsdk/events/server';
import type { EventData } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventData: EventData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-custom',
    type: 'CUSTOM'
  };

  await init(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: true,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    siteName: process.env.SITE_ID || ''
  });

  const EPResponse = await event(req, eventData);
  res.status(200).json(EPResponse);
}
