import type { NextApiRequest, NextApiResponse } from 'next';
import { decorateAll, resetAllDecorators } from '../../utils/e2e-decorators/decorate-all';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import type { PersonalizeData } from '@sitecore-cloudsdk/personalize/server';
import { capturedDebugLogs } from '../../utils/debugLogs';
import { personalize } from '@sitecore-cloudsdk/personalize/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestUrl = new URL(req.url as string, `https://${req.headers.host}`);
  const event: PersonalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: requestUrl.searchParams?.get('friendlyId') || '',
    language: 'EN'
  };

  if (requestUrl.searchParams?.get('includeUTMParams') === 'true')
    event.params = {
      utm: {
        campaign: 'campaign',
        source: 'test'
      }
    };

  await CloudSDK(req, res, {
    cookieExpiryDays: 400,
    enableServerCookie: requestUrl.searchParams?.get('enableServerCookie')?.toLowerCase() === 'true',
    siteName: process.env.SITE_ID || '',
    sitecoreEdgeContextId: process.env.CONTEXT_ID || ''
  })
    .addPersonalize()
    .initialize();

  const timeoutParam = requestUrl.searchParams.get('timeout');
  const timeout = timeoutParam !== 'null' && timeoutParam !== 'undefined' ? Number(timeoutParam) : undefined;

  const testID = requestUrl.searchParams?.get('testID');

  if (testID === 'sendPersonalizeFromAPIWithCorrelationID') decorateAll(testID);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const EPResponse = await personalize(req, event, { timeout });

  if (testID === 'sendPersonalizeFromAPIWithCorrelationID') resetAllDecorators();

  res.status(200).json({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EPResponse,
    capturedDebugLogs: capturedDebugLogs
      .filter((item) => typeof item === 'string' && item.includes('Personalize request'))
      .pop()
  });
}
