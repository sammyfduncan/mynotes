
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotePage from './pages/NotePage';
import CreateNotesPage from './pages/CreateNotesPage';
import AccountPage from './pages/AccountPage';
import PrivateRoute from './components/PrivateRoute';
import PageTransition from './components/PageTransition';
import { getLoggedInUser } from './services/api';

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        
        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}> 
          <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        </Route>
        <Route path="/notes/:id" element={<PrivateRoute />}> 
          <Route path="/notes/:id" element={<PageTransition><NotePage /></PageTransition>} />
        </Route>
        <Route path="/create" element={<PrivateRoute />}> 
          <Route path="/create" element={<PageTransition><CreateNotesPage /></PageTransition>} />
        </Route>
        <Route path="/account" element={<PrivateRoute />}> 
          <Route path="/account" element={<PageTransition><AccountPage /></PageTransition>} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await getLoggedInUser(); // This will either succeed or the interceptor will handle the 401
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();

    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, []);

  if (isLoading) {
    return <div />; // Or a loading spinner
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          <Header isAuthenticated={isAuthenticated} />
          <main className="p-8">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
