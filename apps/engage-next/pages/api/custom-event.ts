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
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  });

  const response = await event(req, eventData);
  res.status(200).json(response);
}
