// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, ICustomEventInput } from '@sitecore-cloudsdk/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: ICustomEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'api-custom',
  };

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieExpiryDays: 400,
    forceServerCookieMode: true,
    pointOfSale:
      requestUrl.searchParams?.get('pointOfSale') ??
      requestUrl.searchParams.get('pointOfSaleFromSettings') ??
      undefined,
    targetURL: requestUrl.searchParams?.get('targetURL') ?? `https://${process.env.TARGET_URL}`,
  });

  const cdpResponse = await eventsServer.event('CUSTOM', event, req);
  res.status(200).json(cdpResponse);
}
