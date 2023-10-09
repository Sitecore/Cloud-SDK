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
    forceServerCookieMode: requestUrl.searchParams?.get('forceServerCookieMode')?.toLowerCase() === 'true',
    pointOfSale:
      (requestUrl.searchParams?.get('pointOfSaleFromSettings') !== 'null'
        ? requestUrl.searchParams?.get('pointOfSaleFromSettings')
        : null) ?? undefined,
    targetURL: requestUrl.searchParams?.get('targetURL') ?? `https://${process.env.TARGET_URL}`,
  });

  const timeoutParam = requestUrl.searchParams.get('timeout');
  const timeout = timeoutParam !== 'null' && timeoutParam !== 'undefined' ? Number(timeoutParam) : undefined;

  const cdpResponse = await personalizeServer.personalize(event, req, timeout);

  res.status(200).json(cdpResponse);
}
