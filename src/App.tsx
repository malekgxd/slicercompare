import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './client/components/ErrorBoundary';
import { Header } from './client/components/Header';
import HomePage from './client/pages/HomePage';
import ResultsPage from './client/pages/ResultsPage';
import SessionDetailPage from './client/pages/SessionDetailPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Dark background with high contrast design system */}
        <div className="min-h-screen bg-app">
          {/* Global Header with Navigation */}
          <Header />

          {/* Route Container */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/sessions/:id" element={<SessionDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>

      {/* Toast notifications container */}
      <Toaster
        position="top-right"
        toastOptions={{
          // Default options are set in toast service
          // This is just for react-hot-toast container configuration
          style: {
            maxWidth: '500px',
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
