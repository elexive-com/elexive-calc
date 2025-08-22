import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RouterProvider, useRouterContext } from './RouterContext';

// Test component to access RouterContext values
const TestComponent = () => {
  const {
    getCurrentTab,
    getModuleUrl,
    isModuleDetailRoute,
    getCurrentModuleSlug,
  } = useRouterContext();

  return (
    <div>
      <div data-testid="current-tab">{getCurrentTab()}</div>
      <div data-testid="module-url">{getModuleUrl('test-module')}</div>
      <div data-testid="is-module-detail">
        {isModuleDetailRoute().toString()}
      </div>
      <div data-testid="current-slug">{getCurrentModuleSlug() || 'none'}</div>
    </div>
  );
};

// Helper function to render component with router
const renderWithRouter = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <RouterProvider>
        <TestComponent />
      </RouterProvider>
    </MemoryRouter>
  );
};

describe('RouterContext', () => {
  test('getCurrentTab returns "modules" for base modules route', () => {
    renderWithRouter('/modules');
    expect(screen.getByTestId('current-tab')).toHaveTextContent('modules');
  });

  test('getCurrentTab returns "modules" for module detail routes', () => {
    renderWithRouter('/modules/foundation-mapping');
    expect(screen.getByTestId('current-tab')).toHaveTextContent('modules');
  });

  test('getCurrentTab returns "introduction" for root route', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('current-tab')).toHaveTextContent('introduction');
  });

  test('getModuleUrl generates correct module URL', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('module-url')).toHaveTextContent(
      '/modules/test-module'
    );
  });

  test('isModuleDetailRoute returns true for module detail routes', () => {
    renderWithRouter('/modules/foundation-mapping');
    expect(screen.getByTestId('is-module-detail')).toHaveTextContent('true');
  });

  test('isModuleDetailRoute returns false for base modules route', () => {
    renderWithRouter('/modules');
    expect(screen.getByTestId('is-module-detail')).toHaveTextContent('false');
  });

  test('getCurrentModuleSlug returns correct slug for module detail routes', () => {
    renderWithRouter('/modules/foundation-mapping');
    expect(screen.getByTestId('current-slug')).toHaveTextContent(
      'foundation-mapping'
    );
  });

  test('getCurrentModuleSlug returns null for non-module routes', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('current-slug')).toHaveTextContent('none');
  });

  test('handles complex module slugs correctly', () => {
    renderWithRouter('/modules/ai-augmented-leadership');
    expect(screen.getByTestId('current-tab')).toHaveTextContent('modules');
    expect(screen.getByTestId('current-slug')).toHaveTextContent(
      'ai-augmented-leadership'
    );
    expect(screen.getByTestId('is-module-detail')).toHaveTextContent('true');
  });
});
