import Init from './components/init';
import { init } from '@sitecore-cloudsdk/search-api-client/server';

export default async function Index() {
  const settings = {
    siteName: 'TestSite',
    sitecoreEdgeContextId: 'abc123',
    userId: 'user123'
  };

  init(settings);

  return (
    <div>
      <h1>
        <span> Hello there, </span>
        Welcome to search-api-client-next 👋
      </h1>
      <Init />
    </div>
  );
}
