import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GraphqlProvider } from '@graphql/graphql-provider';
import { SettingsProvider } from '@context/settings.context';
import { ThemeProvider } from '@theme/theme.provider';
import { Layout } from '@layouts/layout';
import { Paths } from '@constants/paths';
import { AuthProvider } from '@context/auth.context';
import { Home } from '@pages/home';
import { Callback } from '@pages/callback';
import { Users } from '@pages/users';
import { PermissionRequiredPage } from '@pages/permission-required';
import { AdminGuard } from '@guards/admin.guard';
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
                  <Route element={<AdminGuard />}>
                    <Route path={Paths.HOME} element={<Home />} />
                    <Route path={Paths.USER_LIST} element={<Users />} />
                  </Route>
                  <Route path={Paths.AUTH_CALLBACK} element={<Callback />} />
                  <Route path={Paths.PERMISSION_REQUIRED} element={<PermissionRequiredPage />} />
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
