import { FC } from 'react';
import { SettingsProvider } from './context/settings.context';
import { ThemeProvider } from './theme/theme.provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/sign-in';
import { GraphqlProvider } from './graphql/graphql-provider';
import { ProjectProvider } from './context/project.context';
import { Layout } from './layouts/layout';
import { SignUp } from './pages/sign-up';
import { ForgotPassword } from './pages/forgot-password';
import { ResetPassword } from './pages/reset-password';

export const App: FC = () => (
  <GraphqlProvider>
    <SettingsProvider>
      <ThemeProvider>
        <Router>
          <ProjectProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </Layout>
          </ProjectProvider>
        </Router>
      </ThemeProvider>
    </SettingsProvider>
  </GraphqlProvider>
);
