import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Elexive Calculator app', () => {
  render(<App />);
  // Check for the Elexive logo alt text which should be present in the header
  const logoElement = screen.getByAltText(/elexive/i);
  expect(logoElement).toBeInTheDocument();
});

test('renders footer with copyright', () => {
  render(<App />);
  // Check for the footer copyright text
  const footerElement = screen.getByText(/© 2025 Elexive Calculator/i);
  expect(footerElement).toBeInTheDocument();
});
