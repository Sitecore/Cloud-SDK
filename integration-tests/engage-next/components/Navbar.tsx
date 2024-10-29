import NavLink from './NavLink';
import React from 'react';
import { useRouter } from 'next/router';

const links = [
  { text: 'Home', path: '/', testId: 'homePage' },
  { text: 'About', path: '/about', testId: 'aboutPage' },
  { text: 'View Event', path: '/viewevent', testId: 'viewEventPage' },
  { text: 'Custom Event', path: '/customevent', testId: 'customEventPage' },
  { text: 'Identity', path: '/identity', testId: 'identityEventPage' },
  { text: 'Get Guest Id', path: '/getGuestId', testId: 'getguestIdPage' },
  { text: 'Form Event', path: '/form', testId: 'formEventPage' },
  { text: 'Event Queue', path: '/eventqueue', testId: 'eventQueuePage' },
  { text: 'Middleware View Event', path: '/middleware-view-event', testId: 'middlewareViewEventPage' },
  { text: 'Middleware Custom Event', path: '/middleware-custom-event', testId: 'middlewareCustomEventPage' },
  { text: 'Middleware Identity Event', path: '/middleware-identity-event', testId: 'middlewareIdentityEventPage' },
  { text: 'Edge Proxy Settings Events', path: '/edge-proxy-settings-events', testId: 'edgeProxySettingsEventsPage' },
  {
    text: 'Edge Proxy Settings Personalize',
    path: '/edge-proxy-settings-personalize',
    testId: 'edgeProxySettingsPersonalizePage'
  },
  {
    text: 'ServerSideProps View Event',
    path: '/server-side-props-view-event',
    testId: 'serverSidePropsViewEventPage'
  },
  {
    text: 'ServerSideProps Custom Event',
    path: '/server-side-props-custom-event',
    testId: 'serverSidePropsCustomEventPage'
  },
  {
    text: 'ServerSideProps Identity Event',
    path: '/server-side-props-identity-event',
    testId: 'serverSidePropsIdentityEventPage'
  },
  {
    text: 'Personalize',
    path: '/personalize',
    testId: 'personalizePage'
  },
  {
    text: 'Middleware personalize geo',
    path: '/middleware-personalize-geo',
    testId: 'middlewarePersonalizeGeo'
  },
  {
    text: 'Middleware personalize geo partial',
    path: '/middleware-personalize-geo-partial',
    testId: 'middlewarePersonalizeGeoPartial'
  },
  {
    text: 'Middleware personalize geo omit',
    path: '/middleware-personalize-geo-omit',
    testId: 'middlewarePersonalizeGeoOmit'
  },
  { text: 'CorrelationID', path: '/correlation-id', testId: 'correlationIDPage' },
  { text: 'SoftwareID', path: '/software-id', testId: 'softwareIDPage' },
  { text: 'RequestedAt', path: '/requested-at', testId: 'requestedAtPage' },
  {
    text: 'Custom Event With Search Data',
    path: '/custom-event-with-search-data',
    testId: 'customEventWithSearchDataPage'
  },
  {
    text: 'PageView Event With Search Data',
    path: '/page-view-event-with-search-data',
    testId: 'pageViewEventWithSearchDataPage'
  },
  {
    text: 'Web Personalization',
    path: '/web-personalization',
    testId: 'webPersonalizationPage'
  },
  {
    text: 'Init Core',
    path: '/init-core',
    testId: 'initCorePage'
  }
];

function Navbar() {
  const { pathname } = useRouter();

  return (
    <nav>
      {links.map((link) => (
        <NavLink
          key={link.path}
          text={link.text}
          path={link.path}
          testId={link.testId}
          isActive={pathname === link.path}
        />
      ))}
    </nav>
  );
}

export default Navbar;
