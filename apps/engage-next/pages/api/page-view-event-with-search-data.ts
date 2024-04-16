import { NextApiRequest, NextApiResponse } from 'next';
import { decorateAll, resetAllDecorators } from '../../utils/e2e-decorators/decorate-all';
import { init, pageView } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const baseEventData = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN'
  };

  await init(req, res, {
    cookieExpiryDays: 400,
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    siteName: process.env.SITE_ID || ''
  });

  const testID = requestUrl.searchParams?.get('testID');

  if (!testID) res.status(200).json({});

  decorateAll(testID as string);
  switch (testID) {
    case 'sendPageViewEventFromAPIWithSearchData':
      await pageView(req, {
        ...baseEventData,
        searchData: { test: 123 }
      });

      break;
    case 'sendPageViewEventFromAPIWithoutSearchData':
      await pageView(req, {
        ...baseEventData
      });

      break;
  }
  resetAllDecorators();

  res.status(200).json({});
}
