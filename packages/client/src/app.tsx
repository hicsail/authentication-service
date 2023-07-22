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
import { Profile } from '@pages/profile';
import { BasicInfo } from '@pages/basic-info';
import { Password } from '@pages/password';

export const App: FC = () => {
  return (
    <SnackbarProvider>
      <SettingsProvider>
        <GraphqlProvider>
          <ThemeProvider>
            <Router>
              <ProjectProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path={Paths.LOGIN} element={<SignIn />} />
                    <Route path={Paths.SIGN_UP} element={<SignUp />} />
                    <Route path={Paths.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Paths.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={Paths.INVITE} element={<Invite />} />
                    <Route path={Paths.PROFILE} element={<Profile />} />
                    <Route path={Paths.BASIC_INFO} element={<BasicInfo />} />
                    <Route path={Paths.PASSWORD} element={<Password />} />
                  </Route>
                </Routes>
              </ProjectProvider>
            </Router>
          </ThemeProvider>
        </GraphqlProvider>
      </SettingsProvider>
    </SnackbarProvider>
  );
};
