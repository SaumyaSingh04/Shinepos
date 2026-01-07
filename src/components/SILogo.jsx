import React from 'react';

const SILogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 120C50 120 60 100 80 100C100 100 120 120 120 120C120 120 140 100 160 100C180 100 190 120 190 120L170 140C170 140 160 120 140 120C120 120 100 140 100 140C100 140 80 120 60 120C40 120 30 140 30 140L50 120Z" fill="#FF6B35"/>
      <path d="M30 80C30 80 40 60 60 60C80 60 100 80 100 80C100 80 120 60 140 60C160 60 170 80 170 80L150 100C150 100 140 80 120 80C100 80 80 100 80 100C80 100 60 80 40 80C20 80 10 100 10 100L30 80Z" fill="#000000"/>
      <text x="40" y="130" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#000000">SI</text>
    </svg>
  );
};

export default SILogo;