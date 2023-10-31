import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, IPersonalizerInput, personalizeServer } from '@sitecore-cloudsdk/personalize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IPersonalizerInput = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: requestUrl.searchParams?.get('friendlyId') || '',
    language: 'EN',
  };

  await initServer(
    {
      cookieExpiryDays: 400,
      enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    },
    req,
    res
  );

  const timeoutParam = requestUrl.searchParams.get('timeout');
  const timeout = timeoutParam !== 'null' && timeoutParam !== 'undefined' ? Number(timeoutParam) : undefined;

  const cdpResponse = await personalizeServer(event, req, timeout);

  res.status(200).json(cdpResponse);
}
