import React, { useEffect, useState } from 'react';

const DiagnosticTest = () => {
  const [cssLoaded, setCssLoaded] = useState(false);
  const [tailwindWorking, setTailwindWorking] = useState(false);
  const [customClassesWorking, setCustomClassesWorking] = useState(false);

  useEffect(() => {
    // Check if CSS is loaded
    const checkCSS = () => {
      const testElement = document.createElement('div');
      testElement.className = 'bg-red-500';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const backgroundColor = computedStyle.backgroundColor;

      document.body.removeChild(testElement);

      // Check if Tailwind is working (bg-red-500 should give red background)
      if (
        backgroundColor === 'rgb(239, 68, 68)' ||
        backgroundColor.includes('239')
      ) {
        setTailwindWorking(true);
      }

      setCssLoaded(true);
    };

    // Check custom classes
    const checkCustomClasses = () => {
      const testElement = document.createElement('div');
      testElement.className = 'elx-btn-primary';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const backgroundColor = computedStyle.backgroundColor;

      document.body.removeChild(testElement);

      // Check if custom classes are working
      if (
        backgroundColor &&
        backgroundColor !== 'rgba(0, 0, 0, 0)' &&
        backgroundColor !== 'transparent'
      ) {
        setCustomClassesWorking(true);
      }
    };

    setTimeout(() => {
      checkCSS();
      checkCustomClasses();
    }, 100);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        CSS Diagnostic Test
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>CSS Loading Status:</h2>
        <p>CSS Loaded: {cssLoaded ? '✅ Yes' : '❌ No'}</p>
        <p>Tailwind Working: {tailwindWorking ? '✅ Yes' : '❌ No'}</p>
        <p>
          Custom Classes Working: {customClassesWorking ? '✅ Yes' : '❌ No'}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Visual Tests:</h2>

        {/* Inline styles test */}
        <div
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
          }}
        >
          This should be RED (inline styles)
        </div>

        {/* Tailwind test */}
        <div className="bg-blue-500 text-white p-3 mb-3 rounded">
          This should be BLUE (Tailwind: bg-blue-500)
        </div>

        {/* Custom class test */}
        <div className="bg-elx-primary text-white p-3 mb-3 rounded">
          This should be PURPLE (Custom: bg-elx-primary)
        </div>

        {/* Elexive button test */}
        <button
          className="elx-btn elx-btn-primary"
          style={{ marginRight: '10px' }}
        >
          Elexive Primary Button
        </button>

        {/* Fallback button with inline styles */}
        <button
          style={{
            backgroundColor: '#FFBD59',
            color: '#2E2266',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
          }}
        >
          Fallback Button (inline styles)
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>CSS Information:</h2>
        <p>Number of stylesheets: {document.styleSheets.length}</p>
        <div>
          <h3>Loaded Stylesheets:</h3>
          {Array.from(document.styleSheets).map((sheet, index) => (
            <p key={index}>
              {index + 1}. {sheet.href || 'Inline stylesheet'}
            </p>
          ))}
        </div>
      </div>

      <div>
        <h2>Browser Information:</h2>
        <p>
          User Agent:{' '}
          {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
        </p>
        <p>
          Current URL:{' '}
          {typeof window !== 'undefined' ? window.location.href : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default DiagnosticTest;
