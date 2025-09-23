import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { Container } from 'react-bootstrap';

import PrivateRoute from './components/PrivateRoute';

import NotePage from './pages/NotePage';

function App() {
  return (
    <Router>
      <Header />
      <Container className="mt-4">
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
      </Container>
    </Router>
  );
}

export default App;