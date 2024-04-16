import { GetServerSidePropsContext } from 'next';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import { init, pageView as pageViewServer } from '@sitecore-cloudsdk/events/server';

const baseEventData = { channel: 'WEB', currency: 'EUR', language: 'EN' };

export default function PageViewEventWithSearchData() {
  const sendPageViewEventFromAPIWithSearchData = async () => {
    await fetch('/api/page-view-event-with-search-data?&testID=sendPageViewEventFromAPIWithSearchData');
  };
  const sendPageViewEventFromAPIWithoutSearchData = async () => {
    await fetch('/api/page-view-event-with-search-data?&testID=sendPageViewEventFromAPIWithoutSearchData');
  };

  const sendPageViewEventFromBrowserWithSearchData = async () => {
    const testID = 'sendPageViewEventFromBrowserWithSearchData';

    decorateAll(testID);
    await pageView({
      ...baseEventData,
      searchData: { test: 123 },
    });
    resetAllDecorators();
  };

  const sendPageViewEventFromBrowserWithoutSearchData = async () => {
    const testID = 'sendPageViewEventFromBrowserWithoutSearchData';

    decorateAll(testID);
    await pageView({
      ...baseEventData,
    });
    resetAllDecorators();
  };

  return (
    <div>
      <div>
        <h1 data-testid='customEventWithSearchDataTitle'>Page view event with search data page</h1>
        <button
          type='button'
          data-testid='sendPageViewEventFromAPIWithSearchData'
          onClick={sendPageViewEventFromAPIWithSearchData}>
          Send pageView event from API with search_data
        </button>
        <button
          type='button'
          data-testid='sendPageViewEventFromAPIWithoutSearchData'
          onClick={sendPageViewEventFromAPIWithoutSearchData}>
          Send pageView event from API without search_data
        </button>
        <button
          type='button'
          data-testid='sendPageViewEventFromBrowserWithSearchData'
          onClick={sendPageViewEventFromBrowserWithSearchData}>
          Send pageView event from browser with search_data
        </button>
        <button
          type='button'
          data-testid='sendPageViewEventFromBrowserWithoutSearchData'
          onClick={sendPageViewEventFromBrowserWithoutSearchData}>
          Send pageView event from browser without search_data
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
    case 'sendPageViewEventFromServerSidePropsWithSearchData':
      await pageViewServer(context.req, {
        ...baseEventData,
        searchData: { test: 123 },
      });

      break;
    case 'sendPageViewEventFromServerSidePropsWithoutSearchData':
      await pageViewServer(context.req, {
        ...baseEventData,
      });

      break;
  }
  resetAllDecorators();

  return { props: {} };
}
