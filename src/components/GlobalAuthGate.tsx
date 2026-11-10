'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { StorageManager } from '@/lib/storage';
import AuthModal from './AuthModal';

const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/login',
  '/signup',
  '/referral',
];

export default function GlobalAuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (isPublic) {
      setShowAuth(false);
      return;
    }

    const checkAuth = () => {
      const loggedIn = StorageManager.isUserLoggedIn();
      if (!loggedIn) {
        setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    };

    checkAuth();

    window.addEventListener('prepora_auth_changed', checkAuth);
    return () => window.removeEventListener('prepora_auth_changed', checkAuth);
  }, [pathname]);

  const handleModalClose = () => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (!isPublic) {
      // Unauthenticated users are not permitted to remain on protected pages
      router.push('/');
    }
    setShowAuth(false);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  return (
    <AuthModal
      isOpen={showAuth}
      onSuccess={handleAuthSuccess}
      onClose={handleModalClose}
      title="Ushbu Bo'limga Kirish Cheklangan"
      subtitle="Darsliklar, testlar, audio AI va barcha amaliyotlardan foydalanish uchun ro'yxatdan o'ting yoki tizimga kiring."
    />
  );
}
