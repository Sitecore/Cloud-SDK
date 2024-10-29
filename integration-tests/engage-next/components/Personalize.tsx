import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/personalize/browser';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';

const Personalize = () => {
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname === '/' ||
      router.pathname.startsWith('/init-events') ||
      router.pathname.startsWith('/init-personalize') ||
      router.pathname.startsWith('/middleware-server-cookie') ||
      router.pathname.startsWith('/server-side-props-server-cookie') ||
      router.pathname.startsWith('/viewevent') ||
      router.pathname.startsWith('/web-personalization') ||
      router.pathname.startsWith('/create-personalize-cookie')
    )
      return;

    CloudSDK({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeUrl: getSettingFromUrlParams('sitecoreEdgeUrl') ?? undefined
    })
      .addPersonalize({ enablePersonalizeCookie: true })
      .initialize();
  }, [router.pathname]);

  return null;
};

export default Personalize;
