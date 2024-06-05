import type { NextApiRequest, NextApiResponse } from 'next';
import { decorateAll, resetAllDecorators } from '../../utils/e2e-decorators/decorate-all';
import { init, pageView } from '@sitecore-cloudsdk/events/server';
import type { PageViewData } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: PageViewData = {
    channel: 'WEB',
    currency: 'EUR',
    page: 'api-view',
    referrer: 'https://www.google.com/'
  };

  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const testID = requestUrl.searchParams?.get('testID');

  await init(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: true,
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  });

  if (testID === 'sendEventFromAPIWithSoftwareID') decorateAll(testID);
  const response = await pageView(req, event);
  resetAllDecorators();
  res.status(200).json(response);
}
