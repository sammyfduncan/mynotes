
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage')); // Notify other components
    navigate('/');
  };

  return (
    <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <Logo />
      <div className="flex items-center space-x-6">
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-electric-blue">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-electric-blue">Create Notes</Link>
              <Link to="/account" className="hover:text-electric-blue">Manage Account</Link>
              <button onClick={handleLogout} className="hover:text-electric-blue">Logout</button>
              <Link to="/dashboard" className="py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">Dashboard</Link>
            </>
          ) : (
            <Link to="/login" className="py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">Login</Link>
          )}
        </nav>
        <button onClick={toggleTheme} className="p-2 rounded-full focus:outline-none">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
