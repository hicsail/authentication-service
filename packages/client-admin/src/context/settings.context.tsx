import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { ThemeType } from '@theme/theme.provider';

export interface Settings {
  theme: ThemeType;
}

const defaultSettings: Settings = {
  theme: 'light'
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
  const [settings, setSettings] = useState<Settings>(restoreSettings());

  useEffect(() => {
    // Save settings to local storage
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, setSettings }} {...props} />;
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const restoreSettings = (): Settings => {
  const settings = localStorage.getItem('settings');
  return settings ? JSON.parse(settings) : defaultSettings;
};

export const useSettings = () => useContext(SettingsContext);
