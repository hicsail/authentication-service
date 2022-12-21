import { FC } from 'react';
import { SettingsProvider } from './context/settings.context';
import { ThemeProvider } from './theme/theme.provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/sign-in';
import { GraphqlProvider } from './graphql/graphql-provider';
import { ProjectProvider } from './context/project.context';
import { Layout } from './layouts/layout';

export const App: FC = () => (
  <GraphqlProvider>
    <SettingsProvider>
      <ThemeProvider>
        <Router>
          <ProjectProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<SignIn />} />
              </Routes>
            </Layout>
          </ProjectProvider>
        </Router>
      </ThemeProvider>
    </SettingsProvider>
  </GraphqlProvider>
);
