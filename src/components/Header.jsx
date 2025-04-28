import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="https://elexive.com/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/elexive-logo-text.png" 
              alt="Elexive" 
              className="header-logo"
            />
          </a>
        </div>
        <nav className="hidden md:flex space-x-6">
          {/* Navigation items can be added here if needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;