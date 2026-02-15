'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsState {
  autoPlayAudio: boolean;
}

interface SettingsContextType {
  settings: SettingsState;
  setAutoPlayAudio: (enabled: boolean) => void;
}

const STORAGE_KEY = 'natureGoSettings';

const DEFAULT_SETTINGS: SettingsState = {
  autoPlayAudio: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, loaded]);

  const setAutoPlayAudio = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, autoPlayAudio: enabled }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setAutoPlayAudio }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
