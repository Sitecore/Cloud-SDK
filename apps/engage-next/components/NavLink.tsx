// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import Link from 'next/link';

function NavLink({ text, path, testId, isActive }: NavLink) {
  return (
    <Link
      href={path}
      data-testid={testId}
      className={`${isActive ? 'active' : ''}`}>
      {text}
    </Link>
  );
}

interface NavLink {
  text: string;
  path: string;
  testId: string;
  isActive: boolean;
}

export default NavLink;
