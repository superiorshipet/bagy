'use client';

import React from 'react';
import { AppSettingsProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppSettingsProvider>
        {children}
        <AuthModal />
      </AppSettingsProvider>
    </AuthProvider>
  );
};
