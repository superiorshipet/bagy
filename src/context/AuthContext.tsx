'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserSession {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
  addresses?: any[];
}

interface AuthContextType {
  user: UserSession | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectAction?: () => void) => void;
  closeAuthModal: () => void;
  loginWithPhone: (phone: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPhone: (phone: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (password: string) => Promise<boolean>;
  logout: () => void;
  pendingAction: (() => void) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bagy_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (action?: () => void) => {
    if (action) setPendingAction(() => action);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const loginWithPhone = async (phone: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, name }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bagy_user', JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل تسجيل الدخول' };
    } catch (e: any) {
      return { success: false, error: e.message || 'خطأ في الاتصال بالخادم' };
    }
  };

  const signUpWithPhone = async (phone: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', phone, password, name }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bagy_user', JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'فشل إنشاء الحساب' };
    } catch (e: any) {
      return { success: false, error: e.message || 'خطأ في الاتصال بالخادم' };
    }
  };

  const loginAsAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin_login', password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bagy_user', JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bagy_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithPhone,
        signUpWithPhone,
        loginAsAdmin,
        logout,
        pendingAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
