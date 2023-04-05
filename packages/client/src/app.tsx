import { FC } from 'react';
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

export const App: FC = () => {
  return (
    <SettingsProvider>
      <GraphqlProvider>
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
      </GraphqlProvider>
    </SettingsProvider>
  );
};
