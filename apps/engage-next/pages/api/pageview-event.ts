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

  const eventsServer = await initServer({
    cookieExpiryDays: 400,
    enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
    contextId: process.env.CONTEXT_ID || '',
    siteId: process.env.SITE_ID || '',
  });

  const cdpResponse = await eventsServer.pageView(event, req);
  res.status(200).json(cdpResponse);
}
