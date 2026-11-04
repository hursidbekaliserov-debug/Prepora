'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { StorageManager } from '@/lib/storage';
import AuthModal from './AuthModal';

export default function GlobalAuthGate() {
  const pathname = usePathname();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Agar login yoki signup sahifasida bo'lsa, modal shart emas
    if (pathname === '/login' || pathname === '/signup') {
      setShowAuth(false);
      return;
    }

    const check = () => {
      const loggedIn = StorageManager.isUserLoggedIn();
      if (!loggedIn) {
        setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    };

    check();

    window.addEventListener('prepora_auth_changed', check);
    return () => window.removeEventListener('prepora_auth_changed', check);
  }, [pathname]);

  return (
    <AuthModal
      isOpen={showAuth}
      onSuccess={() => setShowAuth(false)}
    />
  );
}
