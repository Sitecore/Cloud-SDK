import { NextRequest } from 'next/server';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { event, identity, pageView } from '@sitecore-cloudsdk/events/server';

export async function requestedAtMiddleware(request: NextRequest): Promise<void> {
  const testID = request?.nextUrl?.searchParams?.get('testID');

  if (!request.nextUrl.pathname.startsWith('/requested-at') || !testID || !testID.includes('FromMiddleware')) return;

  const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

  decorateAll(testID as string);
  switch (testID) {
    case 'sendCustomEventFromMiddlewareWithRequestedAt':
      await event(request, {
        ...baseEventData,
        type: 'CUSTOM_EVENT',
      });

      break;
    case 'sendPageViewEventFromMiddlewareWithRequestedAt':
      await pageView(request, baseEventData);

      break;
    case 'sendIdentityEventFromMiddlewareWithRequestedAt':
      await identity(request, {
        ...baseEventData,
        email: 'test@test.com',
        identifiers: [{ id: '', provider: 'email' }],
      });

      break;
  }
  resetAllDecorators();
}
