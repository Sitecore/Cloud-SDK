// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { init, ICustomEventInput, event } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventData: ICustomEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-custom',
  };

  await init(
    {
      cookieExpiryDays: 400,
      enableServerCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    },
    req,
    res
  );

  const cdpResponse = await event('CUSTOM', eventData, req);
  res.status(200).json(cdpResponse);
}
