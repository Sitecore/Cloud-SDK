// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { init, PageViewData, pageView } from '@sitecore-cloudsdk/events/server';
import { decorateAll, resetAllDecorators } from '../../utils/e2e-decorators/decorate-all';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: PageViewData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-view',
    referrer: 'https://www.google.com/',
  };

  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const testID = requestUrl.searchParams?.get('testID');

  await init(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: true,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    siteName: process.env.SITE_ID || '',
  });

  if (testID === 'sendEventFromAPIWithSoftwareID') decorateAll(testID);
  const EPResponse = await pageView(req, event);
  resetAllDecorators();
  res.status(200).json(EPResponse);
}
