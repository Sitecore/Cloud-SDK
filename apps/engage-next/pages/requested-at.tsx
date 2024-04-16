import { GetServerSidePropsContext } from 'next';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { event, form, identity, pageView } from '@sitecore-cloudsdk/events/browser';
import {
  init,
  event as eventServer,
  identity as identityServer,
  pageView as pageViewServer,
} from '@sitecore-cloudsdk/events/server';

const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

export default function RequestedAt() {
  const sendCustomEventFromAPIWithRequestedAt = async () => {
    await fetch('/api/requested-at?&testID=sendCustomEventFromAPIWithRequestedAt');
  };
  const sendPageViewEventFromAPIWithRequestedAt = async () => {
    await fetch('/api/requested-at?&testID=sendPageViewEventFromAPIWithRequestedAt');
  };
  const sendIdentityEventFromAPIWithRequestedAt = async () => {
    await fetch('/api/requested-at?&testID=sendIdentityEventFromAPIWithRequestedAt');
  };

  const sendCustomEventFromBrowserWithRequestedAt = async () => {
    const testID = 'sendCustomEventFromBrowserWithRequestedAt';

    decorateAll(testID);
    await event({
      ...baseEventData,
      type: 'CUSTOM_EVENT',
    });
    resetAllDecorators();
  };
  const sendPageViewEventFromBrowserWithRequestedAt = async () => {
    const testID = 'sendPageViewEventFromBrowserWithRequestedAt';

    decorateAll(testID);
    await pageView(baseEventData);
    resetAllDecorators();
  };

  const sendIdentityEventFromBrowserWithRequestedAt = async () => {
    const testID = 'sendIdentityEventFromBrowserWithRequestedAt';

    decorateAll(testID);
    await identity({
      ...baseEventData,
      email: 'test@test.com',
      identifiers: [{ id: '', provider: 'email' }],
    });
    resetAllDecorators();
  };
  const sendFormEventFromBrowserWithRequestedAt = async () => {
    const testID = 'sendFormEventFromBrowserWithRequestedAt';

    decorateAll(testID);
    await form('test_id', 'VIEWED');
    resetAllDecorators();
  };

  return (
    <div>
      <div>
        <h1 data-testid='requestedAtPageTitle'>Requested At page</h1>
        <button
          type='button'
          data-testid='sendCustomEventFromAPIWithRequestedAt'
          onClick={sendCustomEventFromAPIWithRequestedAt}>
          Send CustomEvent From API With requested_at
        </button>
        <button
          type='button'
          data-testid='sendPageViewEventFromAPIWithRequestedAt'
          onClick={sendPageViewEventFromAPIWithRequestedAt}>
          Send PageView From API With requested_at
        </button>
        <button
          type='button'
          data-testid='sendIdentityEventFromAPIWithRequestedAt'
          onClick={sendIdentityEventFromAPIWithRequestedAt}>
          Send PageView From API With requested_at
        </button>
        <button
          type='button'
          data-testid='sendCustomEventFromBrowserWithRequestedAt'
          onClick={sendCustomEventFromBrowserWithRequestedAt}>
          Send CustomEvent From Browser With requested_at
        </button>
        <button
          type='button'
          data-testid='sendPageViewEventFromBrowserWithRequestedAt'
          onClick={sendPageViewEventFromBrowserWithRequestedAt}>
          Send PageView From Browser With requested_at
        </button>
        <button
          type='button'
          data-testid='sendIdentityEventFromBrowserWithRequestedAt'
          onClick={sendIdentityEventFromBrowserWithRequestedAt}>
          Send Identity From Browser With requested_at
        </button>
        <button
          type='button'
          data-testid='sendFormEventFromBrowserWithRequestedAt'
          onClick={sendFormEventFromBrowserWithRequestedAt}>
          Send Form Event With requested_at
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const testID = context.query.testID;

  if (!testID || !testID.includes('FromServerSideProps')) return { props: {} };

  await init(context.req, context.res, {
    sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
    siteName: process.env.SITE_ID || '',
  });

  decorateAll(testID as string);
  switch (testID) {
    case 'sendCustomEventFromServerSidePropsWithRequestedAt':
      await eventServer(context.req, {
        ...baseEventData,
        type: 'CUSTOM_EVENT',
      });

      break;
    case 'sendPageViewEventFromServerSidePropsWithRequestedAt':
      await pageViewServer(context.req, baseEventData);

      break;
    case 'sendIdentityEventFromServerSidePropsWithRequestedAt':
      await identityServer(context.req, {
        ...baseEventData,
        email: 'test@test.com',
        identifiers: [{ id: '', provider: 'email' }],
      });

      break;
  }
  resetAllDecorators();

  return { props: {} };
}
