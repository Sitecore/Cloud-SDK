import type { NextApiRequest, NextApiResponse } from 'next';
import { decorateAll, resetAllDecorators } from '../../utils/e2e-decorators/decorate-all';
import { event, init } from '@sitecore-cloudsdk/events/server';

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
    case 'sendCustomEventFromAPIWithSearchData':
      await event(req, {
        ...baseEventData,
        type: 'CUSTOM_EVENT',
        searchData: { test: 123 }
      });

      break;
    case 'sendCustomEventFromAPIWithoutSearchData':
      await event(req, {
        ...baseEventData,
        type: 'CUSTOM_EVENT'
      });

      break;
  }
  resetAllDecorators();

  res.status(200).json({});
}
