'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Navigation nicht im Dashboard anzeigen
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Navigation />;
}

