import { NextApiRequest, NextApiResponse } from 'next';
import { initServer, IPersonalizerInput } from '@sitecore-cloudsdk/personalize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IPersonalizerInput = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: requestUrl.searchParams?.get('friendlyId') || '',
    language: 'EN',
  };

  if (requestUrl.searchParams?.get('pointOfSale') !== 'null')
    event.pointOfSale = requestUrl.searchParams?.get('pointOfSale') ?? 'spinair.com';

  const personalizeServer = initServer({
    clientKey: process.env.CLIENT_KEY || '',
    cookieExpiryDays: 400,
    enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
    pointOfSale:
      (requestUrl.searchParams?.get('pointOfSaleFromSettings') !== 'null'
        ? requestUrl.searchParams?.get('pointOfSaleFromSettings')
        : null) ?? undefined,
    contextId: 'N/A',
    siteId: 'N/A',
  });

  const timeoutParam = requestUrl.searchParams.get('timeout');
  const timeout = timeoutParam !== 'null' && timeoutParam !== 'undefined' ? Number(timeoutParam) : undefined;

  const cdpResponse = await personalizeServer.personalize(event, req, timeout);

  res.status(200).json(cdpResponse);
}
