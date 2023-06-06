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
import { Invite } from '@pages/invite';
import { SnackbarProvider } from '@context/snackbar.context';

export const App: FC = () => {
  return (
    <SnackbarProvider>
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
                    <Route path={Paths.INVITE} element={<Invite />} />
                  </Routes>
                </Layout>
              </ProjectProvider>
            </Router>
          </ThemeProvider>
        </GraphqlProvider>
      </SettingsProvider>
    </SnackbarProvider>
  );
};
