// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { init, IPageViewEventInput, pageView } from '@sitecore-cloudsdk/events/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: IPageViewEventInput = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-view',
    referrer: 'https://www.google.com/',
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

  const EPResponse = await pageView(event, req);
  res.status(200).json(EPResponse);
}
