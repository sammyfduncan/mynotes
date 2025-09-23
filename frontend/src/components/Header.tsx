
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-electric-blue">
        <Logo />
        MyNotes
      </Link>
      <nav className="flex items-center gap-8">
        <Link to="/" className="text-lg hover:text-electric-blue">Home</Link>
        <Link to="/about" className="text-lg hover:text-electric-blue">About</Link>
        {isAuthenticated && <Link to="/dashboard" className="text-lg hover:text-electric-blue">Dashboard</Link>}
        <button onClick={toggleTheme} className="text-lg">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="px-4 py-2 bg-electric-blue text-white rounded-lg">Logout</button>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-electric-blue text-white rounded-lg">Login / Signup</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
