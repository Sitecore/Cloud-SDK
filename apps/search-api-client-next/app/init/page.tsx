'use client';
import { type BrowserSettings, init } from '@sitecore-cloudsdk/search-api-client/browser';

export default async function Page() {
  async function initSearchWithEnableBrowserCookieTrue() {
    const settings: BrowserSettings = {
      enableBrowserCookie: true,
      siteName: 'TestSite',
      userId: 'user123',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    };
    await init(settings);
  }
  async function initSearchWithEnableBrowserCookieFalse() {
    const settings: BrowserSettings = {
      enableBrowserCookie: false,
      siteName: 'TestSite',
      userId: 'user123',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    };
    await init(settings);
  }
  return (
    <div>
      <h1>init function</h1>
      <button
        type='button'
        data-testid='initSearchWithEnableBrowserCookieTrue'
        onClick={initSearchWithEnableBrowserCookieTrue}>
        init Search with <code>enableBrowserCookie=true</code>
      </button>
      <br />
      <button
        type='button'
        data-testid='initSearchWithEnableBrowserCookieFalse'
        onClick={initSearchWithEnableBrowserCookieFalse}>
        init Search with <code>enableBrowserCookie=false</code>
      </button>
    </div>
  );
}
