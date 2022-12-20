import { FC } from 'react';
import { SettingsProvider } from './context/settings';
import { ThemeProvider } from './theme/theme.provider';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/sign-in';

export const App: FC = () => (
  <SettingsProvider>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </SettingsProvider>
);
