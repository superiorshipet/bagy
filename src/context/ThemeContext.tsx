'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type Currency = 'EGP' | 'SAR' | 'USD' | 'AED' | 'EUR';
export type Locale = 'ar' | 'en';

interface AppSettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  locale: Locale;
  toggleLocale: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [currency, setCurrencyState] = useState<Currency>('EGP');
  const [locale, setLocale] = useState<Locale>('ar');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('bagy_theme') as Theme | null;
      if (savedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
        document.body?.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
        document.body?.classList.remove('dark');
      }

      const savedCurrency = localStorage.getItem('bagy_currency') as Currency | null;
      if (savedCurrency && ['EGP', 'SAR', 'USD', 'AED', 'EUR'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('bagy_currency', c);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('bagy_theme', nextTheme);
    } catch (e) {}

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
  };

  const toggleLocale = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    setLocale(nextLocale);
    document.documentElement.setAttribute('dir', nextLocale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', nextLocale);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        locale,
        toggleLocale,
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
