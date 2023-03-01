import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/layout';
import { Callback } from './pages/callback';
import { AuthProvider } from './context/auth.context';
import { Home } from './pages/home';
import { Users } from './pages/users';
import { GraphqlProvider } from './graphql/graphql-provider';

export const App: FC = () => {
  return (
    <GraphqlProvider>
      <Router>
        <Layout>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/callback" element={<Callback />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </AuthProvider>
        </Layout>
      </Router>
    </GraphqlProvider>
  );
};
