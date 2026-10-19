'use client';

import React from 'react';
import { AppSettingsProvider } from '@/context/ThemeContext';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppSettingsProvider>{children}</AppSettingsProvider>;
};
