import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalculator, 
  faLayerGroup, 
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
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <header className="elx-header relative">
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
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Module Explorer
          </button>
        </nav>
      </div>
      
      {/* New mobile menu implementation - fixed positioning */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[70px] left-0 right-0 bg-elx-primary border-t border-gray-700 shadow-lg">
          <nav className="flex flex-col w-full">
            <button
              onClick={() => handleNavClick('introduction')}
              className={`w-full flex items-center py-4 px-4 text-base font-medium ${
                activeTab === 'introduction'
                  ? 'text-elx-accent bg-gray-800'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Introduction
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className={`w-full flex items-center py-4 px-4 text-base font-medium ${
                activeTab === 'calculator'
                  ? 'text-elx-accent bg-gray-800'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <FontAwesomeIcon icon={faCalculator} className="mr-3" />
              Guided Calculator
            </button>
            <button
              onClick={() => handleNavClick('explorer')}
              className={`w-full flex items-center py-4 px-4 text-base font-medium ${
                activeTab === 'explorer'
                  ? 'text-elx-accent bg-gray-800'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <FontAwesomeIcon icon={faLayerGroup} className="mr-3" />
              Module Explorer
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;