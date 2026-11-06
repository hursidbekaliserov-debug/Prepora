'use client';

import { useEffect } from 'react';
import { StorageManager } from '@/lib/storage';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        themeParams?: {
          bg_color?: string;
          text_color?: string;
        };
      };
    };
  }
}

export default function TelegramWebAppInit() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // Check if user info is provided from Telegram
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
          const profile = StorageManager.getProfile();
          let modified = false;

          // If default name, update to Telegram name
          if (profile.fullName === 'Student' || !profile.fullName) {
            profile.fullName = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() || tgUser.username || 'Student';
            modified = true;
          }

          // If avatar is empty and telegram photo is present, update
          if (!profile.avatarUrl && tgUser.photo_url) {
            profile.avatarUrl = tgUser.photo_url;
            modified = true;
          }

          if (modified) {
            StorageManager.saveProfile(profile);
          }
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init notice:', e);
    }
  }, []);

  return null;
}
