// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useRouter } from 'next/router';
import React from 'react';
import NavLink from './NavLink';

const links = [
  { text: 'Home', path: '/', testId: 'homePage' },
  { text: 'About', path: '/about', testId: 'aboutPage' },
  { text: 'View Event', path: '/viewevent', testId: 'viewEventPage' },
  { text: 'Custom Event', path: '/customevent', testId: 'customEventPage' },
  { text: 'Identity', path: '/identity', testId: 'identityEventPage' },
  { text: 'Get Guest Id', path: '/getGuestId', testId: 'getguestIdPage' },
  { text: 'Web Experiences', path: '/webexperiences', testId: 'webExperiencesPage' },
  { text: 'Form Event', path: '/form', testId: 'formEventPage' },
  { text: 'Middleware View Event', path: '/middleware-view-event', testId: 'middlewareViewEventPage' },
  { text: 'Middleware Custom Event', path: '/middleware-custom-event', testId: 'middlewareCustomEventPage' },
  { text: 'Middleware Identity Event', path: '/middleware-identity-event', testId: 'middlewareIdentityEventPage' },
  {
    text: 'ServerSideProps View Event',
    path: '/server-side-props-view-event',
    testId: 'serverSidePropsViewEventPage',
  },
  {
    text: 'ServerSideProps Custom Event',
    path: '/server-side-props-custom-event',
    testId: 'serverSidePropsCustomEventPage',
  },
  {
    text: 'ServerSideProps Identity Event',
    path: '/server-side-props-identity-event',
    testId: 'serverSidePropsIdentityEventPage',
  },
  { text: 'Fallback PointOfSale', path: '/fallbackPointOfSale', testId: 'fallbackPointOfSale' },
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
