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
    // Admin route protection: only super admin can access
    if (pathname.startsWith('/admin')) {
      if (!StorageManager.isAdminLoggedIn()) {
        router.push('/login');
      }
      setShowAuth(false);
      return;
    }

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    if (isPublic) {
      setShowAuth(false);
      return;
    }

    const checkAuth = async () => {
      // 1. Check if user was deleted/banned by admin
      if (StorageManager.isCurrentUserDeleted()) {
        StorageManager.logout();
        alert("Sizning hisobingiz administrator tomonidan o'chirildi.");
        router.push('/login');
        return;
      }

      // Check with server if active session email is banned
      try {
        const sessionRaw = typeof window !== 'undefined' ? localStorage.getItem('prepora_active_session') : null;
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session.email) {
            const res = await fetch(`/api/admin/users?email=${encodeURIComponent(session.email)}`).then(r => r.json()).catch(() => null);
            if (res && res.evicted) {
              StorageManager.logout();
              alert("Sizning hisobingiz administrator tomonidan o'chirildi.");
              router.push('/login');
              return;
            }
          }
        }
      } catch {}

      const loggedIn = StorageManager.isUserLoggedIn();
      if (!loggedIn) {
        setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    };

    checkAuth();

    // Check account validity every 10 seconds
    const evictionTimer = setInterval(checkAuth, 10000);

    window.addEventListener('prepora_auth_changed', checkAuth);
    return () => {
      clearInterval(evictionTimer);
      window.removeEventListener('prepora_auth_changed', checkAuth);
    };
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
