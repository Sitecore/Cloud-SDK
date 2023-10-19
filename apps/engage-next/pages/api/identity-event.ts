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

  if (requestUrl.searchParams?.get('pointOfSale') !== 'null')
    event.pointOfSale = requestUrl.searchParams?.get('pointOfSale') || undefined;

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieExpiryDays: 400,
    enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
    pointOfSale:
      (requestUrl.searchParams?.get('pointOfSaleFromSettings') !== 'null'
        ? requestUrl.searchParams?.get('pointOfSaleFromSettings')
        : null) ?? undefined,
    contextId: 'N/A',
    siteId: 'N/A',
  });

  const cdpResponse = await eventsServer.identity(event, req);
  res.status(200).json(cdpResponse);
}
