// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import './index.css';
import { init as initEvent } from '@sitecore-cloudsdk/events';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { init as initPersonalize } from '@sitecore-cloudsdk/personalize';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.startsWith('/templates/') && window.Engage?.triggerExperiences) {
      window.Engage.triggerExperiences();
    }
  }, [router.pathname]);

  const loadEvents = useCallback(async () => {
    await initEvent({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie:
        getSettingFromUrlParams('enableBrowserCookie') === 'true'
          ? true
          : getSettingFromUrlParams('enableServerCookie') === 'true'
          ? false
          : true,
      contextId: process.env.CONTEXT_ID || '',
      siteId: process.env.SITE_ID || '',
    });
  }, []);

  useEffect(() => {
    if (
      router.pathname.startsWith('/edge-proxy-settings-events') ||
      router.pathname.startsWith('/edge-proxy-settings-personalize')
    )
      return;

    loadEvents();
  }, [loadEvents, router.pathname]);

  // Personalize
  const loadPersonalize = useCallback(async () => {
    const SettingFromUrlParams = getSettingFromUrlParams('webPersonalizationSettings');

    const webPersonalizationSettings = SettingFromUrlParams
      ? parseWebPersonalizationConfig(SettingFromUrlParams)
      : null;

    if (webPersonalizationSettings?.baseURLOverride == 'undefined') {
      webPersonalizationSettings.baseURLOverride = undefined;
    }
    await initPersonalize({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie: true,
      contextId: process.env.CONTEXT_ID || '',
      siteId: process.env.SITE_ID || '',
    });
  }, []);

  useEffect(() => {
    if (
      router.pathname.startsWith('/edge-proxy-settings-events') ||
      router.pathname.startsWith('/edge-proxy-settings-personalize')
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

function parseWebPersonalizationConfig(urlParamsString: string) {
  return urlParamsString ? JSON.parse(urlParamsString) : null;
}
