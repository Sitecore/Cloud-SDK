import type { NextApiRequest, NextApiResponse } from 'next';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { event } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await CloudSDK(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  })
    .addEvents()
    .initialize();

  const response = await event(req, {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-custom',
    type: 'CUSTOM'
  });

  res.status(200).json(response);
}
