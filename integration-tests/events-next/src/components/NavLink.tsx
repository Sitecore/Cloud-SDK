import Link from 'next/link';

function NavLink({ text, path, isActive }: NavLink) {
  return (
    <li>
      <Link
        href={path}
        className={`${isActive ? 'active' : ''}`}>
        {text}
      </Link>
    </li>
  );
}

interface NavLink {
  text: string;
  path: string;
  isActive: boolean;
}

export default NavLink;
