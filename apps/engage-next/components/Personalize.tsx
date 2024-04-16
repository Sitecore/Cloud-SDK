import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { init } from '@sitecore-cloudsdk/personalize/browser';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Personalize = () => {
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname.startsWith('/edge-proxy-settings-events') ||
      router.pathname.startsWith('/edge-proxy-settings-personalize') ||
      router.pathname.startsWith('/middleware-server-cookie') ||
      router.pathname.startsWith('/server-side-props-server-cookie') ||
      router.pathname.startsWith('/async-init-personalize') ||
      router.pathname.startsWith('/async-init-events')
    )
      return;

    init({
      cookieDomain: getSettingFromUrlParams('cookieDomain') ?? 'localhost',
      cookieExpiryDays: 400,
      enableBrowserCookie: true,
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
      sitecoreEdgeUrl: getSettingFromUrlParams('sitecoreEdgeUrl') ?? undefined,
    });
  }, [router.pathname]);

  return null;
};

export default Personalize;
