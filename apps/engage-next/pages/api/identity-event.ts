// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, IIdentityEventAttributesInput } from '@sitecore-cloudsdk/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IIdentityEventAttributesInput = {
    channel: 'WEB',
    currency: 'EUR',
    email: requestUrl.searchParams?.get('email') ?? undefined,
    firstName: 'John',
    identifiers: [
      {
        id: requestUrl.searchParams?.get('email') || '',
        provider: 'email',
      },
    ],
    language: 'EN',
    lastName: 'Doe',
  };

  const eventsServer = await initServer({
    cookieExpiryDays: 400,
    enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
    contextId: process.env.CONTEXT_ID || '',
    siteId: process.env.SITE_ID || '',
  });

  console.log(event);
  const cdpResponse = await eventsServer.identity(event, req);
  res.status(200).json(cdpResponse);
}
