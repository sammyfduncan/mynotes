import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-3">
        <svg 
            width="28" 
            height="28" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-electric-blue"
        >
            <path d="M6 26V6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 26" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 6V26" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 6H28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 14H26" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-2xl font-bold text-electric-blue">NoteForger</span>
    </Link>
  );
};

export default Logo;