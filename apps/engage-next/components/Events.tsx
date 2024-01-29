import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { init } from '@sitecore-cloudsdk/events/browser';

const Events = () => {
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

    const badSitecoreEdgeContextId = getSettingFromUrlParams('badSitecoreEdgeContextIdBrowser') ?? undefined;

    init({
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
  }, [router.pathname]);

  return null;
};

export default Events;
