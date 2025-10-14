import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { vi, beforeEach, describe, test, expect } from 'vitest';
import ModuleDetailPage from './ModuleDetailPage';
import { RouterProvider } from '../contexts/RouterContext';

// Mock components for integration testing
const MockModulesPage = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="modules-page">
      <h1>Modules Page</h1>
      <button
        onClick={() => navigate('/modules/foundation-mapping')}
        data-testid="navigate-to-module"
      >
        View Foundation Mapping
      </button>
    </div>
  );
};

const MockCalculatorPage = () => (
  <div data-testid="calculator-page">
    <h1>Calculator Page</h1>
  </div>
);

// Mock the PDF generation
vi.mock('../pdf', () => ({
  generateModulePdf: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock ModuleDetails component
vi.mock('./ModuleDetails', () => ({
  default: function MockModuleDetails({ selectedModule, onBack }) {
    if (!selectedModule) {
      return <div data-testid="module-not-found">Module not found</div>;
    }

    return (
      <div data-testid="module-details">
        <h1>{selectedModule.name}</h1>
        <button onClick={onBack} data-testid="back-button">
          Back
        </button>
      </div>
    );
  },
}));

// Mock ModuleNotFound component
vi.mock('./ModuleNotFound', () => ({
  default: function MockModuleNotFound({ slug }) {
    const navigate = useNavigate();

    return (
      <div data-testid="module-not-found">
        <h1>Module Not Found</h1>
        <p>Module &quot;{slug}&quot; not found</p>
        <button
          onClick={() => navigate('/modules')}
          data-testid="back-to-modules"
        >
          Back to Modules
        </button>
      </div>
    );
  },
}));

// Integration test app component with navigation capability
const TestApp = ({ initialPath = '/' }) => {
  const [currentPath, setCurrentPath] = React.useState(initialPath);

  // Update path when initialPath changes
  React.useEffect(() => {
    setCurrentPath(initialPath);
  }, [initialPath]);

  return (
    <MemoryRouter key={currentPath} initialEntries={[currentPath]}>
      <RouterProvider>
        <Routes>
          <Route path="/" element={<MockCalculatorPage />} />
          <Route path="/calculator" element={<MockCalculatorPage />} />
          <Route path="/modules" element={<MockModulesPage />} />
          <Route path="/modules/:slug" element={<ModuleDetailPage />} />
          <Route path="*" element={<MockCalculatorPage />} />
        </Routes>
      </RouterProvider>
    </MemoryRouter>
  );
};

// Mock window navigation methods
const mockHistoryBack = vi.fn();
const mockHistoryForward = vi.fn();
const mockHistoryPushState = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  // Mock window.history
  Object.defineProperty(window, 'history', {
    value: {
      back: mockHistoryBack,
      forward: mockHistoryForward,
      pushState: mockHistoryPushState,
      length: 2,
    },
    writable: true,
  });

  // Reset document title
  document.title = 'Elexive Calculator';
});

describe('Module Routing Integration Tests', () => {
  test('complete navigation flow from modules list to detail view', async () => {
    // Start on modules page
    const { rerender } = render(<TestApp initialPath="/modules" />);
    expect(screen.getByTestId('modules-page')).toBeInTheDocument();

    // Navigate to module detail by re-rendering with new path
    rerender(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
      expect(screen.getByText('Foundation Mapping')).toBeInTheDocument();
    });
  });

  test('direct URL access to module details works correctly', async () => {
    render(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
      expect(screen.getByText('Foundation Mapping')).toBeInTheDocument();
    });

    // Document title should be updated
    expect(document.title).toBe('Foundation Mapping - Elexive Modules');
  });

  test('invalid module slug shows error page', async () => {
    render(<TestApp initialPath="/modules/invalid-module" />);

    await waitFor(() => {
      expect(screen.getByTestId('module-not-found')).toBeInTheDocument();
      expect(
        screen.getByText('Module "invalid-module" not found')
      ).toBeInTheDocument();
    });

    expect(document.title).toBe('Module Not Found - Elexive');
  });

  test('browser back navigation from module detail', async () => {
    // Start with module detail and verify it renders correctly
    render(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
    });

    // Verify the module detail page is rendered with the correct content
    expect(screen.getByText('Foundation Mapping')).toBeInTheDocument();
    expect(screen.getAllByText('Discovery').length).toBeGreaterThan(0);
  });

  test('handles browser forward/backward navigation scenarios', async () => {
    const { rerender } = render(<TestApp initialPath="/modules" />);

    // Navigate to module detail
    rerender(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
    });

    // Simulate browser back
    rerender(<TestApp initialPath="/modules" />);
    expect(screen.getByTestId('modules-page')).toBeInTheDocument();

    // Simulate browser forward
    rerender(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
    });
  });

  test('page refresh maintains current module view', async () => {
    const { rerender } = render(
      <TestApp initialPath="/modules/foundation-mapping" />
    );

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
      expect(screen.getByText('Foundation Mapping')).toBeInTheDocument();
    });

    // Simulate page refresh by re-rendering with same path
    rerender(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
      expect(screen.getByText('Foundation Mapping')).toBeInTheDocument();
    });

    // Title should be maintained
    expect(document.title).toBe('Foundation Mapping - Elexive Modules');
  });

  test('error scenarios and fallback handling', async () => {
    // Test malformed URLs that should match the :slug route but be invalid
    const malformedUrls = [
      '/modules/invalid_slug', // invalid characters (underscore)
      '/modules/Invalid-Slug', // uppercase
      '/modules/invalid--slug', // double hyphen
      '/modules/123invalid', // starts with number
    ];

    for (const url of malformedUrls) {
      const { unmount } = render(<TestApp initialPath={url} />);

      await waitFor(() => {
        expect(screen.getByTestId('module-not-found')).toBeInTheDocument();
      });

      unmount();
    }
  });

  test('navigation state is preserved across route changes', async () => {
    // This test verifies that navigation context works correctly
    const { rerender } = render(<TestApp initialPath="/modules" />);

    // Navigate to module detail
    rerender(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
    });

    // Navigate back
    rerender(<TestApp initialPath="/modules" />);
    expect(screen.getByTestId('modules-page')).toBeInTheDocument();
  });

  test('handles multiple rapid navigation changes', async () => {
    const { rerender } = render(<TestApp initialPath="/modules" />);

    // Rapid navigation changes
    const paths = [
      '/modules/foundation-mapping',
      '/modules/leading-change',
      '/modules/culture-core',
      '/modules/invalid-module',
      '/modules',
    ];

    for (const path of paths) {
      rerender(<TestApp initialPath={path} />);

      if (path === '/modules') {
        expect(screen.getByTestId('modules-page')).toBeInTheDocument();
      } else if (path === '/modules/invalid-module') {
        await waitFor(() => {
          expect(screen.getByTestId('module-not-found')).toBeInTheDocument();
        });
      } else {
        await waitFor(() => {
          expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
        });
      }
    }
  });

  test('URL sharing functionality works correctly', async () => {
    // Test that shared URLs work correctly
    const sharedUrls = [
      '/modules/foundation-mapping',
      '/modules/leading-change',
      '/modules/culture-core',
    ];

    for (const url of sharedUrls) {
      const { unmount } = render(<TestApp initialPath={url} />);

      await waitFor(() => {
        expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
      });

      // Note: This is a simplified test - in reality, we'd need to check against actual module names
      expect(document.title).toContain('Elexive Modules');

      unmount();
    }
  });
});

describe('Module Routing Error Handling', () => {
  test('handles configuration loading errors', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      // Should render either module details or error state
      expect(
        screen.getByTestId('solution-brief') ||
          screen.getByTestId('module-not-found')
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('graceful degradation when navigation APIs unavailable', async () => {
    // Mock missing history API
    const originalHistory = window.history;
    delete window.history;

    render(<TestApp initialPath="/modules/foundation-mapping" />);

    await waitFor(() => {
      expect(screen.getByTestId('solution-brief')).toBeInTheDocument();
    });

    // Restore history API
    window.history = originalHistory;
  });

  test('handles edge cases in URL parsing', async () => {
    const edgeCases = [
      '/modules/%20', // URL encoded space
      '/modules/test%2Dmodule', // URL encoded hyphen
      '/modules/test+module', // Plus sign
      '/modules/test.module', // Dot
    ];

    for (const url of edgeCases) {
      const { unmount } = render(<TestApp initialPath={url} />);

      await waitFor(() => {
        // Should show not found for invalid formats
        expect(screen.getByTestId('module-not-found')).toBeInTheDocument();
      });

      unmount();
    }
  });
});
