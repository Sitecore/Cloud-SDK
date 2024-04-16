import { PageViewData, pageView } from '@sitecore-cloudsdk/events/browser';
import { decorateAll, resetAllDecorators } from '../utils/e2e-decorators/decorate-all';
import { init as initServer, pageView as pageViewServer } from '@sitecore-cloudsdk/events/server';
import { GetServerSidePropsContext } from 'next';

export default function EventSoftwareIDHeaderPage() {
  const sendEventFromAPIWithSoftwareID = async () => {
    const serverData = { channel: 'WEB', currency: 'EUR' };

    const queryString = Object.keys(serverData)
      .map((key) => key + '=' + serverData[key as keyof typeof serverData])
      .join('&');

    await fetch(`/api/pageview-event?timeout=2000&testID=sendEventFromAPIWithSoftwareID&$${queryString}`);
  };

  const sendEventFromBrowserWithSoftwareID = async () => {
    const testID = 'sendEventFromBrowserWithSoftwareID';

    decorateAll(testID);
    const eventData: PageViewData = {
      channel: 'WEB',
      currency: 'EUR',
    };

    await pageView(eventData);
    resetAllDecorators();
  };

  return (
    <div>
      <div>
        <h1 data-testid='softwarePageTitle'>Event SoftwareID HeaderPage page</h1>
        <button
          type='button'
          data-testid='sendEventFromAPIWithSoftwareID'
          onClick={sendEventFromAPIWithSoftwareID}>
          Request Event From API With Software ID
        </button>
        <button
          type='button'
          data-testid='sendEventFromBrowserWithSoftwareID'
          onClick={sendEventFromBrowserWithSoftwareID}>
          Request Event From Browser With Software ID
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const testID = context.query.testID;

  if (testID === 'sendEventFromServerSidePropsWithSoftwareID') {
    const eventData = {
      channel: 'WEB',
      currency: 'EUR',
      email: 'testServerSideProps@test.com',
      identifiers: [{ id: 'testServerSideProps@test.com', provider: 'email' }],
    };
    await initServer(context.req, context.res, {
      cookieExpiryDays: 400,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    });

    decorateAll(testID as string);
    await pageViewServer(context.req, eventData as unknown as PageViewData);

    resetAllDecorators();
  }

  return { props: {} };
}
