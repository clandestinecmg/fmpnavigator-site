// components/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

export default function NavLink({
  href,
  children,
  className,
  activeClassName = 'text-white',
}: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== '/' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx('hover:text-white', className, { [activeClassName]: isActive })}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}