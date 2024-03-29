import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { ThemeType } from '@theme/theme.provider';

export interface Settings {
  theme: ThemeType;
  lastProject?: string;
  VITE_AUTH_SERVICE?: string;
  VITE_GOOGLE_CLIENT_ID?: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  VITE_AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

export interface SettingsContextProps {
  settings: Settings;
  setSettings: (key: keyof Settings, value: string) => void;
}

const SettingsContext = createContext<SettingsContextProps>({} as SettingsContextProps);

export interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const [settings, saveSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Restore settings from local storage
    restoreSettings().then((settings) => saveSettings(settings));
  }, []);

  useEffect(() => {
    // Save settings to local storage
    saveToLocalStorage(settings);
  }, [settings]);

  const setSettings = (key: keyof Settings, value: string) => {
    if (settings && settings[key] === value) {
      // skip if value is the same, causes an infinite loop if removed
      return;
    }
    saveSettings({
      ...settings,
      [key]: value
    });
  };

  return <SettingsContext.Provider value={{ settings, setSettings }} {...props} />;
};

const saveToLocalStorage = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const restoreSettings = async (): Promise<Settings> => {
  let settings = defaultSettings;
  const storedSettings = localStorage.getItem('settings');
  if (storedSettings) {
    settings = { ...settings, ...JSON.parse(storedSettings) };
  }
  try {
    const response = await fetch('/env.json');
    const env = await response.json();
    settings = { ...settings, ...env };
  } catch (e) {
    console.error(e);
  }
  return settings;
};

export const useSettings = () => useContext(SettingsContext);
