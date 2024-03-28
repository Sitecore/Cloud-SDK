import { NextApiRequest, NextApiResponse } from 'next';
import { init, PersonalizeData, personalize } from '@sitecore-cloudsdk/personalize/server';
import { capturedDebugLogs } from '../../utils/debugLogs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: PersonalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: requestUrl.searchParams?.get('friendlyId') || '',
    language: 'EN',
  };

  if (requestUrl.searchParams?.get('includeUTMParams') === 'true') {
    event.params = {
      utm: {
        campaign: 'campaign',
        source: 'test',
      },
    };
  }

  await init(
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

  const EPResponse = await personalize(req, event, { timeout });

  res.status(200).json({
    EPResponse,
    capturedDebugLogs: capturedDebugLogs
      .filter((item) => (item as unknown as string).includes('Personalize request'))
      .pop(),
  });
}
