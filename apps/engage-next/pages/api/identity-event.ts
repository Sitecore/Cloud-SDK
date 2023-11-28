// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { init, IIdentityEventAttributesInput, identity } from '@sitecore-cloudsdk/events/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: IIdentityEventAttributesInput = {
    channel: 'WEB',
    currency: 'EUR',
    email: requestUrl.searchParams?.get('email') ?? undefined,
    firstName: 'John',
    identifiers: [
      {
        id: requestUrl.searchParams?.get('email') || '',
        provider: 'email',
      },
    ],
    language: 'EN',
    lastName: 'Doe',
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

  const EPResponse = await identity(event, req);
  res.status(200).json(EPResponse);
}
