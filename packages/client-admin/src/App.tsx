import { GraphqlProvider } from '@graphql/graphql-provider';
import { SettingsProvider } from '@context/settings.context';
import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestPage } from '@pages/test';
import { Layout } from '@layouts/layout';

function App() {
  return (
    <GraphqlProvider>
      <SettingsProvider>
        <ThemeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<TestPage />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </SettingsProvider>
    </GraphqlProvider>
  );
}

export default App;
