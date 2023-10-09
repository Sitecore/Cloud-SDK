// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { initServer, IPageViewEventInput } from '@sitecore-cloudsdk/events';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IPageViewEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-view',
    referrer: 'https://www.google.com/',
  };

  const searchParams = new URLSearchParams(requestUrl.searchParams);

  event.pointOfSale = searchParams.get('pointOfSale') ?? 'spinair.com';

  const eventsServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieExpiryDays: 400,
    forceServerCookieMode: requestUrl.searchParams?.get('forceServerCookieMode')?.toLowerCase() === 'true',
    pointOfSale:
      (requestUrl.searchParams?.get('pointOfSaleFromSettings') !== 'null'
        ? requestUrl.searchParams?.get('pointOfSaleFromSettings')
        : null) ?? undefined,
    targetURL: requestUrl.searchParams?.get('targetURL') ?? `https://${process.env.TARGET_URL}`,
  });

  const cdpResponse = await eventsServer.pageView(event, req);
  res.status(200).json(cdpResponse);
}
