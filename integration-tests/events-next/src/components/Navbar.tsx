'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import NavLink from './NavLink';

const links = [
  { text: 'home', path: '/' },
  { text: 'init', path: '/init' },
  { text: 'event', path: '/event' },
  { text: 'identity', path: '/identity' },
  { text: 'event queue', path: '/event-queue' },
  { text: 'form', path: '/form' },
  { text: 'pageView', path: '/page-view' },
  { text: 'miscellaneous requested at', path: '/miscellaneous-requested-at' },
  { text: 'miscellaneous software id', path: '/miscellaneous-software-id' }
];

function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
      <ul>
        <Image
          src='/logo-sitecore.svg'
          width={124}
          height={24}
          alt='Sitecore'
        />
        {links.map((link) => (
          <NavLink
            key={link.path}
            text={link.text}
            path={link.path}
            isActive={pathname === link.path}
          />
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
