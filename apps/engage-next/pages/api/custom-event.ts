// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, ICustomEventInput, eventServer } from '@sitecore-cloudsdk/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: ICustomEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-custom',
  };

  await initServer(
    {
      cookieExpiryDays: 400,
      enableServerCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    },
    req,
    res
  );

  const cdpResponse = await eventServer('CUSTOM', event, req);
  res.status(200).json(cdpResponse);
}
