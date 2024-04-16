import { blue, cyan, green, red, yellow } from '@sitecore-cloudsdk/utils';
import { getSettingFromUrlParams } from '../utils/getSettingFromUrlParams';
import { init } from '@sitecore-cloudsdk/events/browser';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Events = () => {
  const router = useRouter();

  useEffect(() => {
    // Since we don't have e2e tests for those let's have something that we can check if needed
    console.log(red('test red in useEffect'), 'reset test');
    console.log(yellow('test yellow in useEffect'), 'reset test');
    console.log(green('test green in useEffect'), 'reset test');
    console.log(cyan('test cyan in useEffect'), 'reset test');
    console.log(blue('test blue in useEffect'), 'reset test');
    console.log(`${red('red')} reset ${blue('blue')}`);

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
      sitecoreEdgeUrl: getSettingFromUrlParams('sitecoreEdgeUrl') ?? undefined
    });
  }, [router.pathname]);

  return null;
};

export default Events;
