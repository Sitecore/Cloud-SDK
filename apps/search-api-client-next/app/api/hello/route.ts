import { init } from '@sitecore-cloudsdk/search-api-client/server';

export async function GET() {
  const settings = {
    siteName: 'TestSite',
    sitecoreEdgeContextId: 'abc123',
    userId: 'user123'
  };

  init(settings);

  return new Response('Hello, from API!');
}
