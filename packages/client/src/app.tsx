import { FC, useEffect, useState } from 'react';
import { SettingsProvider } from '@context/settings.context';
import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignIn } from '@pages/sign-in';
import { GraphqlProvider } from '@graphql/graphql-provider';
import { ProjectProvider } from '@context/project.context';
import { Layout } from '@layouts/layout';
import { SignUp } from '@pages/sign-up';
import { ForgotPassword } from '@pages/forgot-password';
import { ResetPassword } from '@pages/reset-password';
import { Paths } from '@constants/paths';
import { loadEnv } from '@utils/env';
import { LoadingScreen } from '@components/loading-screen';

export const App: FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadEnv().then(() => setLoading(false));
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <GraphqlProvider>
      <SettingsProvider>
        <ThemeProvider>
          <Router>
            <ProjectProvider>
              <Layout>
                <Routes>
                  <Route path={Paths.LOGIN} element={<SignIn />} />
                  <Route path={Paths.SIGN_UP} element={<SignUp />} />
                  <Route path={Paths.FORGOT_PASSWORD} element={<ForgotPassword />} />
                  <Route path={Paths.RESET_PASSWORD} element={<ResetPassword />} />
                </Routes>
              </Layout>
            </ProjectProvider>
          </Router>
        </ThemeProvider>
      </SettingsProvider>
    </GraphqlProvider>
  );
};
