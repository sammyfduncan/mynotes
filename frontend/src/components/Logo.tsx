import React from 'react';

const Logo: React.FC = () => {
  return (
    <svg className="w-8 h-8 mr-2" viewBox="0 0 100 100">
      <path d="M20,10 L80,10 L80,90 L20,90 Z" fill="none" stroke="currentColor" strokeWidth="10" />
      <path d="M30,30 L70,30" stroke="currentColor" strokeWidth="8" />
      <path d="M30,50 L70,50" stroke="currentColor" strokeWidth="8" />
      <path d="M30,70 L50,70" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
};

export default Logo;