'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Initiales Laden
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setLoading(false);
        setIsInitialLoad(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    // Zeige Loading bei Route-Wechsel (nur nach initialem Laden)
    if (!isInitialLoad) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialLoad]);

  if (!loading) return null;

  return <LoadingScreen />;
}
