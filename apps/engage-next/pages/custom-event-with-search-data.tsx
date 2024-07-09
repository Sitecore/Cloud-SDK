import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { event as eventServer, init } from '@sitecore-cloudsdk/events/server';
import type { GetServerSidePropsContext } from 'next';
import { event } from '@sitecore-cloudsdk/events/browser';

const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

export default function SearchData() {
  const sendCustomEventFromAPIWithSearchData = async () => {
    await fetch('/api/custom-event-with-search-data?&testID=sendCustomEventFromAPIWithSearchData');
  };
  const sendCustomEventFromAPIWithoutSearchData = async () => {
    await fetch('/api/custom-event-with-search-data?&testID=sendCustomEventFromAPIWithoutSearchData');
  };

  const sendCustomEventFromBrowserWithSearchData = async () => {
    const testID = 'sendCustomEventFromBrowserWithSearchData';

    decorateAll(testID);
    await event({
      ...baseEventData,
      type: 'CUSTOM_EVENT',
      searchData: { test: 123 }
    });
    resetAllDecorators();
  };

  const sendCustomEventFromBrowserWithoutSearchData = async () => {
    const testID = 'sendCustomEventFromBrowserWithoutSearchData';

    decorateAll(testID);
    await event({
      ...baseEventData,
      type: 'CUSTOM_EVENT'
    });
    resetAllDecorators();
  };

  return (
    <div>
      <div>
        <h1 data-testid='customEventWithSearchDataTitle'>Custom event with search data page</h1>
        <button
          type='button'
          data-testid='sendCustomEventFromAPIWithSearchData'
          onClick={sendCustomEventFromAPIWithSearchData}>
          Send CustomEvent From API With search_data
        </button>
        <button
          type='button'
          data-testid='sendCustomEventFromAPIWithoutSearchData'
          onClick={sendCustomEventFromAPIWithoutSearchData}>
          Send CustomEvent From API Without search_data
        </button>
        <button
          type='button'
          data-testid='sendCustomEventFromBrowserWithSearchData'
          onClick={sendCustomEventFromBrowserWithSearchData}>
          Send CustomEvent From Browser With search_data
        </button>
        <button
          type='button'
          data-testid='sendCustomEventFromBrowserWithoutSearchData'
          onClick={sendCustomEventFromBrowserWithoutSearchData}>
          Send CustomEvent From Browser Without search_data
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
    siteName: process.env.SITE_ID || ''
  });

  decorateAll(testID as string);
  switch (testID) {
    case 'sendCustomEventFromServerSidePropsWithSearchData':
      await eventServer(context.req, {
        ...baseEventData,
        type: 'CUSTOM_EVENT',
        searchData: { test: 123 }
      });

      break;
    case 'sendCustomEventFromServerSidePropsWithoutSearchData':
      await eventServer(context.req, {
        ...baseEventData,
        type: 'CUSTOM_EVENT'
      });

      break;
  }
  resetAllDecorators();

  return { props: {} };
}
