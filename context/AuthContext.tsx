'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  locationArea: string;
  avatarUrl?: string;
  createdAt?: string;
  isGoogleUser?: boolean;
}

// Initial Seed Registered Users (Includes ZimBarter demo traders)
const SEED_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'user-263783237918',
    fullName: 'Sekuru Chauke Livestock & Grain',
    phoneNumber: '+263783237918',
    email: 'sekuru@zimbarter.co.zw',
    locationArea: 'Chiredzi / Triangle',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-263772000000',
    fullName: 'Harare Wholesalers Direct',
    phoneNumber: '+263772000000',
    email: 'harare@zimbarter.co.zw',
    locationArea: 'Harare CBD',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-google-demo',
    fullName: 'Tendai Moyo',
    phoneNumber: '+263771987654',
    email: 'tendai.moyo@gmail.com',
    locationArea: 'Bulawayo CBD',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Tendai%20Moyo',
    createdAt: new Date().toISOString(),
    isGoogleUser: true,
  }
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  registeredUsers: UserProfile[];
  login: (data: { fullName: string; phoneNumber: string; email?: string; locationArea?: string }) => void;
  attemptSignIn: (identifier: string) => { success: boolean; user?: UserProfile; message?: string };
  registerUser: (data: { fullName: string; phoneNumber: string; email?: string; locationArea?: string; avatarUrl?: string; isGoogleUser?: boolean }) => { success: boolean; user?: UserProfile; message?: string };
  signInWithGoogle: (googleProfile: { email: string; name: string; avatarUrl?: string }) => { isRegistered: boolean; user?: UserProfile; message?: string };
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalPrompt: string;
  authModalTab: 'login' | 'signup';
  setAuthModalTab: (tab: 'login' | 'signup') => void;
  openAuthModal: (promptMsg?: string, initialTab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  registeredUsers: SEED_REGISTERED_USERS,
  login: () => {},
  attemptSignIn: () => ({ success: false, message: 'Auth context not initialized' }),
  registerUser: () => ({ success: false, message: 'Auth context not initialized' }),
  signInWithGoogle: () => ({ isRegistered: false, message: 'Auth context not initialized' }),
  logout: () => {},
  isAuthModalOpen: false,
  authModalPrompt: '',
  authModalTab: 'login',
  setAuthModalTab: () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(SEED_REGISTERED_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Load registered users registry from local storage
    const savedRegistry = localStorage.getItem('zimbarter_registered_users');
    if (savedRegistry) {
      try {
        const parsedRegistry: UserProfile[] = JSON.parse(savedRegistry);
        if (Array.isArray(parsedRegistry) && parsedRegistry.length > 0) {
          // Merge seed users with saved registered users
          const merged = [...SEED_REGISTERED_USERS];
          parsedRegistry.forEach((saved) => {
            if (!merged.some((m) => m.id === saved.id || (saved.phoneNumber && m.phoneNumber === saved.phoneNumber))) {
              merged.push(saved);
            }
          });
          setRegisteredUsers(merged);
        }
      } catch (e) {
        console.error('Error parsing stored registered users:', e);
      }
    }

    // Load active logged-in user state
    const savedUser = localStorage.getItem('zimbarter_current_user') || localStorage.getItem('chiredzi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user state:', e);
      }
    }
  }, []);

  const saveRegistryToStorage = (usersList: UserProfile[]) => {
    try {
      localStorage.setItem('zimbarter_registered_users', JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to save user registry to localStorage:', e);
    }
  };

  // Helper to search user by Phone, Email, or ID
  const findRegisteredUser = (identifier: string): UserProfile | undefined => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');

    return registeredUsers.find((u) => {
      // Direct Email match
      if (u.email && u.email.trim().toLowerCase() === clean) return true;
      // Phone number match
      if (cleanDigits && cleanDigits.length >= 6 && u.phoneNumber) {
        const uDigits = u.phoneNumber.replace(/\D/g, '');
        if (uDigits === cleanDigits || uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits)) return true;
      }
      // ID match
      if (u.id === clean) return true;
      return false;
    });
  };

  // Standard Login (Attempts to sign in an existing user)
  const attemptSignIn = (identifier: string): { success: boolean; user?: UserProfile; message?: string } => {
    if (!identifier.trim()) {
      return { success: false, message: 'Please enter your phone number or email address.' };
    }

    const existing = findRegisteredUser(identifier);

    if (!existing) {
      return {
        success: false,
        message: `Account not found for "${identifier}". You have not registered yet — please create an account first.`,
      };
    }

    // Account found: Log in user
    setUser(existing);
    localStorage.setItem('zimbarter_current_user', JSON.stringify(existing));
    localStorage.setItem('chiredzi_user', JSON.stringify(existing));
    setIsAuthModalOpen(false);

    return {
      success: true,
      user: existing,
      message: `Welcome back, ${existing.fullName}! Signed in successfully.`,
    };
  };

  // Create/Register New User Account
  const registerUser = (data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    locationArea?: string;
    avatarUrl?: string;
    isGoogleUser?: boolean;
  }): { success: boolean; user?: UserProfile; message?: string } => {
    const cleanPhone = data.phoneNumber ? data.phoneNumber.replace(/\D/g, '') : '';
    const cleanEmail = data.email ? data.email.trim().toLowerCase() : '';

    // Check if phone or email is ALREADY registered
    if (data.phoneNumber && cleanPhone.length >= 6) {
      const existingPhoneUser = findRegisteredUser(data.phoneNumber);
      if (existingPhoneUser) {
        return {
          success: false,
          user: existingPhoneUser,
          message: `Phone number "${data.phoneNumber}" is already registered. Please sign in instead.`,
        };
      }
    }

    if (cleanEmail) {
      const existingEmailUser = findRegisteredUser(cleanEmail);
      if (existingEmailUser) {
        return {
          success: false,
          user: existingEmailUser,
          message: `Email address "${cleanEmail}" is already registered. Please sign in instead.`,
        };
      }
    }

    const deterministicId = cleanPhone
      ? `user-phone-${cleanPhone}`
      : (cleanEmail ? `user-email-${cleanEmail.replace(/[^a-z0-9]/g, '')}` : `user-${Date.now()}`);

    const newUser: UserProfile = {
      id: deterministicId,
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email?.trim() || '',
      locationArea: data.locationArea || 'Harare CBD',
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
      createdAt: new Date().toISOString(),
      isGoogleUser: data.isGoogleUser || false,
    };

    const updatedRegistry = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedRegistry);
    saveRegistryToStorage(updatedRegistry);

    setUser(newUser);
    localStorage.setItem('zimbarter_current_user', JSON.stringify(newUser));
    localStorage.setItem('chiredzi_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);

    return {
      success: true,
      user: newUser,
      message: `Account created successfully! Welcome to ZimBarter, ${newUser.fullName}.`,
    };
  };

  // Sign In with Google
  const signInWithGoogle = (googleProfile: {
    email: string;
    name: string;
    avatarUrl?: string;
  }): { isRegistered: boolean; user?: UserProfile; message?: string } => {
    const existing = findRegisteredUser(googleProfile.email);

    if (existing) {
      // Existing user registered with this Google email -> Log in directly!
      setUser(existing);
      localStorage.setItem('zimbarter_current_user', JSON.stringify(existing));
      localStorage.setItem('chiredzi_user', JSON.stringify(existing));
      setIsAuthModalOpen(false);
      return {
        isRegistered: true,
        user: existing,
        message: `Welcome back, ${existing.fullName}! Signed in via Google.`,
      };
    }

    // Google user not registered yet -> Need registration step (asks for Zim location & phone)
    return {
      isRegistered: false,
      message: `Google Account (${googleProfile.email}) verified! Please complete your ZimBarter profile details below to finalize registration.`,
    };
  };

  // Backward compatible alias
  const login = (data: { fullName: string; phoneNumber: string; email?: string; locationArea?: string }) => {
    registerUser({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      locationArea: data.locationArea || 'Harare CBD',
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zimbarter_current_user');
    localStorage.removeItem('chiredzi_user');
  };

  const openAuthModal = (promptMsg: string = '', initialTab: 'login' | 'signup' = 'login') => {
    setAuthModalPrompt(promptMsg);
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        registeredUsers,
        login,
        attemptSignIn,
        registerUser,
        signInWithGoogle,
        logout,
        isAuthModalOpen,
        authModalPrompt,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

