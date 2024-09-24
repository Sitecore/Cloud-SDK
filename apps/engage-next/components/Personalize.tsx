import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/personalize/browser';

const Personalize = () => {
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname.startsWith('/init-events') ||
      router.pathname.startsWith('/init-personalize') ||
      router.pathname.startsWith('/middleware-server-cookie') ||
      router.pathname.startsWith('/server-side-props-server-cookie') ||
      router.pathname.startsWith('/viewevent') ||
      router.pathname.startsWith('/web-personalization')
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
      .addPersonalize()
      .initialize();
  }, [router.pathname]);

  return null;
};

export default Personalize;
