import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/layout';
import { Callback } from './pages/callback';
import { AuthProvider } from './context/auth.context';
import { Home } from './pages/home';

export const App: FC = () => {
  return (
    <Router>
      <Layout>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<Callback />} />
          </Routes>
        </AuthProvider>
      </Layout>
    </Router>
  );
};
