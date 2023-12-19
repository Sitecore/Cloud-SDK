// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import './index.css';
import { init as initEvent } from '@sitecore-cloudsdk/events/browser';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { init as initPersonalize } from '@sitecore-cloudsdk/personalize/browser';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const loadEvents = useCallback(async () => {
    const badSitecoreEdgeContextId = getSettingFromUrlParams('badSitecoreEdgeContextIdBrowser') ?? undefined;

    await initEvent({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie:
        getSettingFromUrlParams('enableBrowserCookie') === 'true'
          ? true
          : getSettingFromUrlParams('enableServerCookie') === 'true'
          ? false
          : true,
      sitecoreEdgeContextId: badSitecoreEdgeContextId || process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeUrl: getSettingFromUrlParams('sitecoreEdgeUrl') ?? undefined,
    });
  }, []);

  useEffect(() => {
    if (
      router.pathname.startsWith('/edge-proxy-settings-events') ||
      router.pathname.startsWith('/edge-proxy-settings-personalize') ||
      router.pathname.startsWith('/middleware-server-cookie') ||
      router.pathname.startsWith('/server-side-props-server-cookie')
    )
      return;

    loadEvents();
  }, [loadEvents, router.pathname]);

  // Personalize
  const loadPersonalize = useCallback(async () => {
    await initPersonalize({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeUrl: getSettingFromUrlParams('sitecoreEdgeUrl') ?? undefined,
    });
  }, []);

  useEffect(() => {
    if (
      router.pathname.startsWith('/edge-proxy-settings-events') ||
      router.pathname.startsWith('/edge-proxy-settings-personalize') ||
      router.pathname.startsWith('/middleware-server-cookie') ||
      router.pathname.startsWith('/server-side-props-server-cookie')
    )
      return;
    loadPersonalize();
  }, [loadPersonalize, router.pathname]);

  return (
    <>
      <Head>
        <title>Welcome to engage-next!</title>
      </Head>
      <main className='app'>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
