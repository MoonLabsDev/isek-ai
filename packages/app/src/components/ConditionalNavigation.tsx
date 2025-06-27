'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

const ConditionalNavigation = () => {
  const pathname = usePathname();

  // Don't show navigation on game route
  if (pathname === '/game') {
    return null;
  }

  return <Navigation />;
};

export default ConditionalNavigation;
