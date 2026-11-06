'use client';

// Session and Cookie Management with 10-minute inactivity expiration

const SESSION_COOKIE_NAME = 'prepora_session_active';
const LAST_ACTIVE_COOKIE_NAME = 'prepora_last_activity_time';
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export class SessionManager {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // Set a browser cookie with standard max-age
  static setCookie(name: string, value: string, maxAgeSeconds: number = 600): void {
    if (!this.isClient()) return;
    try {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
    } catch (e) {
      console.warn('Failed to set cookie:', e);
    }
  }

  // Get a cookie by name
  static getCookie(name: string): string | null {
    if (!this.isClient()) return null;
    try {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    } catch {
      return null;
    }
  }

  // Delete cookie
  static deleteCookie(name: string): void {
    if (!this.isClient()) return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Record user activity and renew the 10-minute cookie
  static touchActivity(): void {
    if (!this.isClient()) return;
    const now = Date.now().toString();
    this.setCookie(LAST_ACTIVE_COOKIE_NAME, now, 600); // 10 minutes
    this.setCookie(SESSION_COOKIE_NAME, 'active', 600);
    try {
      localStorage.setItem('prepora_last_active_ts', now);
    } catch {}
  }

  // Check if session has expired (>10 minutes inactive)
  static checkAndExpireSession(): boolean {
    if (!this.isClient()) return false;

    const cookieLastActive = this.getCookie(LAST_ACTIVE_COOKIE_NAME);
    const storageLastActive = localStorage.getItem('prepora_last_active_ts');
    const lastActiveStr = cookieLastActive || storageLastActive;

    if (!lastActiveStr) {
      // First visit or already expired
      return false;
    }

    const lastActive = parseInt(lastActiveStr, 10);
    const now = Date.now();

    if (isNaN(lastActive) || now - lastActive > INACTIVITY_TIMEOUT_MS) {
      // 10 minutes passed! Clear session and draft data
      this.clearSessionAndDrafts();
      return true; // Expired
    }

    // Still valid, renew timestamp
    this.touchActivity();
    return false;
  }

  // Clear session, draft inputs, and cookies
  static clearSessionAndDrafts(): void {
    if (!this.isClient()) return;
    this.deleteCookie(SESSION_COOKIE_NAME);
    this.deleteCookie(LAST_ACTIVE_COOKIE_NAME);

    try {
      localStorage.removeItem('prepora_active_session');
      localStorage.removeItem('prepora_last_active_ts');
      localStorage.removeItem('prepora_draft_form');
      localStorage.removeItem('prepora_draft_receipt');
      window.dispatchEvent(new Event('prepora_auth_changed'));
    } catch {}
  }

  // Initialize listeners across the app
  static initSessionWatcher(): () => void {
    if (!this.isClient()) return () => {};

    // Initial check on page load
    this.checkAndExpireSession();

    const handleUserInteraction = () => {
      this.touchActivity();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const expired = this.checkAndExpireSession();
        if (!expired) {
          this.touchActivity();
        }
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic check every 1 minute
    const interval = setInterval(() => {
      this.checkAndExpireSession();
    }, 60000);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }
}

