import type { NextApiRequest, NextApiResponse } from 'next';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import type { IdentityData } from '@sitecore-cloudsdk/events/server';
import { identity } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IdentityData = {
    channel: 'WEB',
    currency: 'EUR',
    email: requestUrl.searchParams?.get('email') ?? undefined,
    firstName: 'John',
    identifiers: [
      {
        id: requestUrl.searchParams?.get('email') || '',
        provider: 'email'
      }
    ],
    language: 'EN',
    lastName: 'Doe'
  };

  await CloudSDK(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  })
    .addEvents()
    .initialize();

  const response = await identity(req, event);
  res.status(200).json(response);
}
