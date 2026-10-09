'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  locationArea: string;
  avatarUrl?: string;
  createdAt?: string;
  isGoogleUser?: boolean;
  isAdmin?: boolean;
}

type AuthResult = { success: boolean; message?: string };

interface AuthContextType {
  /** Merged auth user + marketplace profile. Null when signed out. */
  user: UserProfile | null;
  isAuthenticated: boolean;
  /** True while the initial session is being restored. */
  authLoading: boolean;
  /** Signed in, but has not yet saved name / WhatsApp number / location. */
  needsProfile: boolean;

  signInWithGoogle: (redirectPath?: string) => Promise<AuthResult>;
  sendEmailOtp: (email: string, redirectPath?: string) => Promise<AuthResult>;
  verifyEmailOtp: (email: string, token: string) => Promise<AuthResult>;
  saveProfile: (data: { fullName: string; phoneNumber: string; locationArea: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;

  isAuthModalOpen: boolean;
  authModalPrompt: string;
  openAuthModal: (promptMsg?: string) => void;
  /** Returns true if the user may proceed; otherwise opens the sign-in modal and returns false. */
  requireAuth: (promptMsg?: string) => boolean;
  closeAuthModal: () => void;
}

const notReady = async (): Promise<AuthResult> => ({ success: false, message: 'Auth not initialized' });

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  authLoading: true,
  needsProfile: false,
  signInWithGoogle: notReady,
  sendEmailOtp: notReady,
  verifyEmailOtp: notReady,
  saveProfile: notReady,
  logout: async () => {},
  isAuthModalOpen: false,
  authModalPrompt: '',
  openAuthModal: () => {},
  requireAuth: () => false,
  closeAuthModal: () => {},
});

// Legacy keys from the old client-side mock auth — purged on load.
const LEGACY_KEYS = ['zimbarter_registered_users', 'zimbarter_current_user', 'chiredzi_user'];

function buildUser(authUser: User, profile: Partial<UserProfile> | null): UserProfile {
  const meta = authUser.user_metadata || {};
  const fallbackName = meta.full_name || meta.name || (authUser.email ? authUser.email.split('@')[0] : 'Trader');
  return {
    id: authUser.id,
    email: authUser.email || '',
    fullName: profile?.fullName || fallbackName,
    phoneNumber: profile?.phoneNumber || '',
    locationArea: profile?.locationArea || 'Harare CBD',
    avatarUrl:
      profile?.avatarUrl ||
      meta.avatar_url ||
      meta.picture ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackName)}`,
    createdAt: profile?.createdAt || authUser.created_at,
    isGoogleUser: authUser.app_metadata?.provider === 'google',
    isAdmin: false, // Granted server-side via role claims in a later step
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile', { cache: 'no-store' });
      const data = await res.json();
      setProfile(data.success ? data.profile : null);
    } catch (e) {
      console.error('Failed to load profile:', e);
      setProfile(null);
    } finally {
      setProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));

    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user ?? null);
      if (data.user) loadProfile();
      else setProfileLoaded(true);
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const next = session?.user ?? null;
      setAuthUser(next);
      if (event === 'SIGNED_IN' && next) {
        setProfileLoaded(false);
        loadProfile();
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setProfileLoaded(true);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase, loadProfile]);

  const user = authUser ? buildUser(authUser, profile) : null;
  const needsProfile = !!authUser && profileLoaded && !profile?.phoneNumber;

  // Force profile completion: keep the modal open until WhatsApp number is saved
  useEffect(() => {
    if (needsProfile) setIsAuthModalOpen(true);
  }, [needsProfile]);

  const callbackUrl = (redirectPath?: string) => {
    const path = redirectPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(path)}`;
  };

  const signInWithGoogle = async (redirectPath?: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl(redirectPath) },
    });
    return error ? { success: false, message: error.message } : { success: true };
  };

  const sendEmailOtp = async (email: string, redirectPath?: string): Promise<AuthResult> => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true, emailRedirectTo: callbackUrl(redirectPath) },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: `We sent a sign-in code to ${clean}. Check your inbox (and spam).` };
  };

  const verifyEmailOtp = async (email: string, token: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    });
    if (error) return { success: false, message: 'That code is invalid or has expired. Request a new one.' };
    return { success: true, message: 'Signed in successfully!' };
  };

  const saveProfile = async (data: { fullName: string; phoneNumber: string; locationArea: string }): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) return { success: false, message: json.error || 'Could not save profile.' };
      setProfile(json.profile);
      return { success: true, message: 'Profile saved. Welcome to ZimBarter!' };
    } catch {
      return { success: false, message: 'Network error while saving profile.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  };

  const openAuthModal = (promptMsg: string = '') => {
    setAuthModalPrompt(promptMsg);
    setIsAuthModalOpen(true);
  };

  const requireAuth = (promptMsg: string = 'Please sign in to continue.') => {
    if (authUser && !needsProfile) return true;
    openAuthModal(authUser ? 'Please complete your profile with a WhatsApp number to continue.' : promptMsg);
    return false;
  };

  const closeAuthModal = () => {
    if (needsProfile) return; // must finish profile first
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!authUser,
        authLoading,
        needsProfile,
        signInWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        saveProfile,
        logout,
        isAuthModalOpen,
        authModalPrompt,
        openAuthModal,
        requireAuth,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
