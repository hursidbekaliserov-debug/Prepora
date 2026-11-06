'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { StorageManager } from '@/lib/storage';
import AuthModal from './AuthModal';

const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/lessons',
  '/referral',
  '/login',
  '/signup',
  '/arena',
  '/vocabulary',
  '/ielts',
  '/sat'
];

export default function GlobalAuthGate() {
  const pathname = usePathname();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Agar ochiq (public) sahifalarda bo'lsa, avtomatik bloklash kerak emas
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (isPublic) {
      setShowAuth(false);
      return;
    }

    const check = () => {
      const loggedIn = StorageManager.isUserLoggedIn();
      // Faqat himoyalangan sahifalarda (settings, dashboard, mock-exam) majburiy auth
      if (!loggedIn && !isPublic) {
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
      onClose={() => setShowAuth(false)}
    />
  );
}

