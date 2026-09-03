'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  locationArea: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (data: { fullName: string; phoneNumber: string; email?: string; locationArea?: string }) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalPrompt: string;
  openAuthModal: (promptMsg?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isAuthModalOpen: false,
  authModalPrompt: '',
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('chiredzi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user state:', e);
      }
    }
  }, []);

  const login = (data: { fullName: string; phoneNumber: string; email?: string; locationArea?: string }) => {
    const cleanPhone = data.phoneNumber ? data.phoneNumber.replace(/\D/g, '') : '';
    const cleanEmail = data.email ? data.email.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const deterministicId = cleanPhone
      ? `user-phone-${cleanPhone}`
      : (cleanEmail ? `user-email-${cleanEmail}` : `user-${Date.now()}`);

    const newUser: UserProfile = {
      id: deterministicId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email || '',
      locationArea: data.locationArea || 'Tshovani',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
    };
    setUser(newUser);
    localStorage.setItem('chiredzi_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chiredzi_user');
  };

  const openAuthModal = (promptMsg: string = '') => {
    setAuthModalPrompt(promptMsg);
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
        login,
        logout,
        isAuthModalOpen,
        authModalPrompt,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
