
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotePage from './pages/NotePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="/notes/:id" element={<PrivateRoute />}>
              <Route path="/notes/:id" element={<NotePage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
