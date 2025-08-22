import React from 'react';

const StyleTest = () => {
  return (
    <div className="p-8 bg-elx-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-elx-primary mb-6">
          Style Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Tailwind utilities */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tailwind Utilities Test
            </h2>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-blue-800">Blue background with blue text</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-green-800">
                  Green background with green text
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <p className="text-yellow-800">
                  Yellow background with yellow text
                </p>
              </div>
            </div>
          </div>

          {/* Test Elexive custom classes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Elexive Custom Classes Test
            </h2>
            <div className="space-y-3">
              <div className="bg-elx-primary p-3 rounded-lg">
                <p className="text-white">Elexive Primary Background</p>
              </div>
              <div className="bg-elx-accent p-3 rounded-lg">
                <p className="text-elx-primary">Elexive Accent Background</p>
              </div>
              <div className="bg-elx-secondary p-3 rounded-lg">
                <p className="text-white">Elexive Secondary Background</p>
              </div>
            </div>
          </div>

          {/* Test custom component classes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Custom Component Classes Test
            </h2>
            <div className="space-y-3">
              <button className="elx-btn elx-btn-primary">
                Primary Button
              </button>
              <button className="elx-btn elx-btn-secondary">
                Secondary Button
              </button>
              <button className="elx-btn elx-btn-accent">Accent Button</button>
            </div>
          </div>

          {/* Test responsive classes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Responsive Test
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-100 p-3 rounded text-center">
                <p className="text-sm">Responsive Grid</p>
              </div>
              <div className="bg-gray-200 p-3 rounded text-center">
                <p className="text-sm">Item 2</p>
              </div>
              <div className="bg-gray-300 p-3 rounded text-center">
                <p className="text-sm">Item 3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Font Test
          </h2>
          <p className="text-base mb-2">
            This text should be in Nunito Sans font (body font)
          </p>
          <h3 className="font-heading text-lg font-semibold">
            This heading should be in Poppins font
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StyleTest;
