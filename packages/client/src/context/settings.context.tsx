import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { ThemeType } from '@theme/theme.provider';

export interface Settings {
  theme: ThemeType;
  lastProject?: string;
  uri?: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  uri: import.meta.env.VITE_AUTH_SERVICE
};

export interface SettingsContextProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextProps>({} as SettingsContextProps);

export interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Restore settings from local storage
    restoreSettings().then((settings) => setSettings(settings));
  }, []);

  useEffect(() => {
    // Save settings to local storage
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, setSettings }} {...props} />;
};

const saveSettings = (settings: Settings) => {
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
