import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/layout';
import { Callback } from './pages/callback';
import { AuthProvider } from './context/auth.context';

export const App: FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/auth/callback" element={<Callback />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};
