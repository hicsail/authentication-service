import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GraphqlProvider } from '@graphql/graphql-provider';
import { SettingsProvider } from '@context/settings.context';
import { ThemeProvider } from '@theme/theme.provider';
import { Layout } from '@layouts/layout';
import { Paths } from '@constants/paths';
import { AuthProvider } from '@context/auth.context';
import { Home } from '@pages/home';
import { Callback } from '@pages/callback';
import { Users } from '@pages/users';
import { ProjectSettings } from '@pages/projectsettings';

export const App: FC = () => {
  return (
    <GraphqlProvider>
      <SettingsProvider>
        <ThemeProvider>
          <Router>
            <Layout>
              <AuthProvider>
                <Routes>
                  <Route path={Paths.HOME} element={<Home />} />
                  <Route path={Paths.AUTH_CALLBACK} element={<Callback />} />
                  <Route path={Paths.USER_LIST} element={<Users />} />
                  <Route path={Paths.PROJECT_SETTINGS} element={<ProjectSettings />} />
                </Routes>
              </AuthProvider>
            </Layout>
          </Router>
        </ThemeProvider>
      </SettingsProvider>
    </GraphqlProvider>
  );
};
