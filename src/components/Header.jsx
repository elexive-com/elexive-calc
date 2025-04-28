import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faCubes, 
  faHome, 
  faBars, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useTabContext } from '../contexts/TabContext';

const Header = () => {
  const { activeTab, setActiveTab } = useTabContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close menu after selection on mobile
  };
  
  return (
    <header className="elx-header relative z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <a href="https://elexive.com/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/elexive-logo-text.png" 
              alt="Elexive" 
              className="elx-header-logo h-8"
            />
          </a>
        </div>
        
        {/* Mobile hamburger button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon 
            icon={mobileMenuOpen ? faTimes : faBars} 
            className="text-xl"
          />
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          <button
            onClick={() => handleNavClick('introduction')}
            className={`flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'introduction'
                ? 'text-elx-accent border-b-2 border-elx-accent'
                : 'text-[#FBFAFC] hover:text-white hover:border-b-2 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Introduction
          </button>
          <button
            onClick={() => handleNavClick('calculator')}
            className={`flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'text-elx-accent border-b-2 border-elx-accent'
                : 'text-[#FBFAFC] hover:text-white hover:border-b-2 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCalculator} className="mr-2" />
            Guided Calculator
          </button>
          <button
            onClick={() => handleNavClick('explorer')}
            className={`flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'text-elx-accent border-b-2 border-elx-accent'
                : 'text-[#FBFAFC] hover:text-white hover:border-b-2 hover:border-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCubes} className="mr-2" />
            Module Explorer
          </button>
        </nav>
      </div>
      
      {/* Mobile menu - slides in from top */}
      <div className={`md:hidden absolute w-full bg-elx-primary transition-all duration-300 ease-in-out shadow-lg ${
        mobileMenuOpen 
          ? 'max-h-60 opacity-100 border-b border-gray-700' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto py-2">
          <button
            onClick={() => handleNavClick('introduction')}
            className={`w-full flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'introduction'
                ? 'text-elx-accent bg-gray-800'
                : 'text-[#FBFAFC] hover:bg-gray-800'
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Introduction
          </button>
          <button
            onClick={() => handleNavClick('calculator')}
            className={`w-full flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'text-elx-accent bg-gray-800'
                : 'text-[#FBFAFC] hover:bg-gray-800'
            }`}
          >
            <FontAwesomeIcon icon={faCalculator} className="mr-2" />
            Guided Calculator
          </button>
          <button
            onClick={() => handleNavClick('explorer')}
            className={`w-full flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'text-elx-accent bg-gray-800'
                : 'text-[#FBFAFC] hover:bg-gray-800'
            }`}
          >
            <FontAwesomeIcon icon={faCubes} className="mr-2" />
            Module Explorer
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;