
import React from 'react';
import styled from 'styled-components';

const LogoSvg = styled.svg`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

const Logo: React.FC = () => {
  return (
    <LogoSvg viewBox="0 0 100 100">
      <path d="M20,10 L80,10 L80,90 L20,90 Z" fill="none" stroke="var(--accent-color)" strokeWidth="10" />
      <path d="M30,30 L70,30" stroke="var(--accent-color)" strokeWidth="8" />
      <path d="M30,50 L70,50" stroke="var(--accent-color)" strokeWidth="8" />
      <path d="M30,70 L50,70" stroke="var(--accent-color)" strokeWidth="8" />
    </LogoSvg>
  );
};

export default Logo;
