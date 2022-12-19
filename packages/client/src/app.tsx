import {FC} from 'react'
import {SettingsProvider} from "./context/settings";
import {ThemeProvider} from "./theme/theme.provider";

export const App: FC = () => (
  <SettingsProvider>
    <ThemeProvider>

    </ThemeProvider>
  </SettingsProvider>
);

