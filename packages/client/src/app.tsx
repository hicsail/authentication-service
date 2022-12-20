import { FC } from 'react';
import { SettingsProvider } from './context/settings.context';
import { ThemeProvider } from './theme/theme.provider';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/sign-in';
import { GraphqlProvider } from './graphql/graphql-provider';
import { ProjectProvider } from './context/project.context';

export const App: FC = () => (
  <GraphqlProvider>
    <SettingsProvider>
      <ThemeProvider>
        <Router>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<SignIn />} />
            </Routes>
          </ProjectProvider>
        </Router>
      </ThemeProvider>
    </SettingsProvider>
  </GraphqlProvider>
);
