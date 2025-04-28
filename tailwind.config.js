/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Keep brand-specific colors (truly custom)
      colors: {
        'elx': {
          'bg': '#FBFAFC',
          'primary': '#2E2266',
          'accent': '#FFBD59',
          'accent-light': 'rgba(255, 189, 89, 0.5)',
          'secondary': '#EB8258',
          'evc': '#FF006E',
          'evc-light': 'rgba(255, 0, 110, 0.15)',
          'discovery-bg': '#FFF6E8',
          'discovery-badge': '#ECE9F3',
          'strategy-badge': '#FFF0E3',
        }
      },
      // Clean up font families (remove elx- prefix)
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      // Keep only truly custom spacing
      spacing: {
        'header': '70px',
      },
      // Remove custom border radius and use Tailwind's built-in
      // Remove custom box shadows and use Tailwind's built-in
      // Clean up animation names (remove elx- prefix)
      animation: {
        'pulse': 'elx-pulse 2s infinite',
        'fade-in': 'elx-fade-in 0.3s ease-in-out forwards',
        'pulse-selection': 'elx-pulse-selection 0.4s ease-out',
      },
      keyframes: {
        'elx-pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 1 },
        },
        'elx-fade-in': {
          'from': { opacity: 0, transform: 'translateY(-10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        'elx-pulse-selection': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        // Common element styles - use native Tailwind tokens where possible
        '.elx-container': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'), // Use Tailwind's built-in
          boxShadow: theme('boxShadow.lg'),       // Use Tailwind's built-in
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
        },
        '.elx-header': {
          backgroundColor: theme('colors.elx.primary'),
          height: theme('spacing.header'),
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          position: 'sticky',
          top: '0',
          zIndex: '100',
          boxShadow: theme('boxShadow.sm'),       // Use Tailwind's built-in
        },
        '.elx-header-logo': {
          height: '40px',
          width: 'auto',
        },
        '.elx-content': {
          paddingTop: `calc(${theme('spacing.header')} + 1rem)`,
        },
        
        // Button styles - use native Tailwind tokens where possible
        '.elx-btn': {
          borderRadius: theme('borderRadius.lg'),  // Use Tailwind's built-in
          transition: 'all 0.2s ease-in-out',
          fontWeight: theme('fontWeight.semibold'),// Use Tailwind's built-in
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&:focus': {
            outline: `3px solid ${theme('colors.elx.accent-light')}`,
            outlineOffset: '2px',
          },
        },
        '.elx-btn-primary': {
          backgroundColor: theme('colors.elx.accent'),
          color: theme('colors.elx.primary'),
          '&:hover': {
            backgroundColor: theme('colors.elx.accent'),
            opacity: '0.9',
          },
        },
        '.elx-btn-secondary': {
          backgroundColor: theme('colors.elx.secondary'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.elx.secondary'),
            opacity: '0.9',
          },
        },
        '.elx-btn-outline': {
          border: `1px solid ${theme('colors.elx.accent')}`,
          backgroundColor: theme('colors.elx.accent-light'),
          color: theme('colors.elx.primary'),
          '&:hover': {
            backgroundColor: theme('colors.elx.accent'),
          },
        },
        
        // Module cards and selectors - use native Tailwind tokens where possible
        '.elx-card': {
          borderRadius: theme('borderRadius.xl'),  // Use Tailwind's built-in
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
        },
        '.elx-option-card': {
          backgroundColor: theme('colors.gray.50'),
          padding: theme('spacing.4'),             // Use Tailwind's built-in
          borderRadius: theme('borderRadius.xl'),
          flexGrow: '1',
          border: '1px solid transparent',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: theme('colors.gray.200'),
            boxShadow: theme('boxShadow.sm'),      // Use Tailwind's built-in
          },
        },
        '.elx-module-card': {
          padding: theme('spacing.4'),             // Use Tailwind's built-in
          borderRadius: theme('borderRadius.xl'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: theme('colors.elx.accent-light'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.sm'),      // Use Tailwind's built-in
          },
        },
        '.elx-module-card-selected': {
          backgroundColor: theme('colors.elx.discovery-bg'),
          borderWidth: '2px',
          borderColor: theme('colors.elx.accent'),
          boxShadow: theme('boxShadow.sm'),
        },
        
        // Tab components - use native Tailwind tokens where possible
        '.elx-tab': {
          position: 'relative',
          padding: theme('spacing.3') + ' ' + theme('spacing.6'), // Use Tailwind's built-in
          fontWeight: theme('fontWeight.medium'),  // Use Tailwind's built-in
          fontSize: theme('fontSize.sm'),          // Use Tailwind's built-in
          transition: 'all 0.2s ease-in-out',
          backgroundColor: theme('colors.gray.200'),
          borderTopLeftRadius: theme('borderRadius.lg'),
          borderTopRightRadius: theme('borderRadius.lg'),
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
        },
        '.elx-tab-active': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.elx.primary'),
          fontWeight: theme('fontWeight.bold'),    // Use Tailwind's built-in
          zIndex: '10',
          borderTopWidth: '2px',
          borderLeftWidth: '2px',
          borderRightWidth: '2px',
          borderTopColor: theme('colors.elx.accent'),
          borderLeftColor: theme('colors.gray.200'),
          borderRightColor: theme('colors.gray.200'),
          boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
        },
        
        // Dropdown items - use native Tailwind tokens where possible
        '.elx-dropdown-item': {
          width: '100%',
          textAlign: 'left',
          padding: theme('spacing.3') + ' ' + theme('spacing.4'), // Use Tailwind's built-in
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: '1px',
          borderBottomColor: theme('colors.gray.100'),
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
          },
          '&:last-child': {
            borderBottomWidth: '0',
          },
        },
        '.elx-dropdown-item-active': {
          backgroundColor: theme('colors.gray.100'),
          fontWeight: theme('fontWeight.medium'),  // Use Tailwind's built-in
        },
        
        // Selectors and indicators - use native Tailwind tokens where possible
        '.elx-selector': {
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme('spacing.2') + ' ' + theme('spacing.3'), // Use Tailwind's built-in
          borderRadius: theme('borderRadius.lg'),  // Use Tailwind's built-in
          transition: 'all 0.2s ease-in-out',
          backgroundColor: theme('colors.white'),
          border: '1px solid ' + theme('colors.gray.200'),
          '&:hover': {
            borderColor: theme('colors.elx.accent-light'),
            transform: 'translateY(-1px)',
          },
        },
        '.elx-selector-selected': {
          borderColor: theme('colors.elx.accent'),
          backgroundColor: 'rgba(255, 189, 89, 0.1)',
        },
        '.elx-indicator': {
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: '2px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out',
          flexShrink: '0',
        },
        '.elx-indicator-selected': {
          borderColor: theme('colors.elx.accent'),
          backgroundColor: theme('colors.elx.accent'),
          '&:after': {
            content: '""',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: theme('colors.white'),
            display: 'block',
          },
        },
        
        // EVC labels and badges - use native Tailwind tokens where possible
        '.elx-evc-label': {
          backgroundColor: theme('colors.elx.evc-light'),
          borderRadius: theme('borderRadius.md'),
          padding: theme('spacing.1') + ' ' + theme('spacing.2'), // Use Tailwind's built-in
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.semibold'), // Use Tailwind's built-in
          color: theme('colors.elx.evc'),
          whiteSpace: 'nowrap',
          minWidth: '60px',
          textAlign: 'center',
        },
        '.elx-badge': {
          fontSize: theme('fontSize.xs'),
          padding: theme('spacing.1') + ' ' + theme('spacing.2'), // Use Tailwind's built-in
          borderRadius: '9999px',
          fontWeight: theme('fontWeight.medium'),   // Use Tailwind's built-in
        },
        '.elx-badge-accent': {
          backgroundColor: theme('colors.elx.accent-light'),
          color: theme('colors.elx.primary'),
        },
        '.elx-badge-discovery': {
          backgroundColor: theme('colors.elx.discovery-badge'),
          color: theme('colors.elx.primary'),
        },
        '.elx-badge-strategy': {
          backgroundColor: theme('colors.elx.strategy-badge'),
          color: theme('colors.elx.secondary'),
        },
        
        // Expandable sections - use native Tailwind tokens where possible
        '.elx-expandable': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.3.5'),           // Use Tailwind's built-in
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        
        // Feature introduction - use native Tailwind tokens where possible
        '.elx-feature-intro': {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.lg'),        // Use Tailwind's built-in
          marginBottom: theme('spacing.8'),        // Use Tailwind's built-in
        },
      })
    }
  ],
}