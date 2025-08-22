import { describe, test, expect } from 'vitest';
import {
  getAllModuleSlugs,
  isValidSlugFormat,
  moduleExists,
  getModuleBySlug,
  validateAllModuleUrls,
  generateSlugFromName,
  testSlugNavigation,
  getUrlValidationSummary,
} from './moduleUrlValidator';

describe('Module URL Validator', () => {
  describe('isValidSlugFormat', () => {
    test('validates correct slug formats', () => {
      const validSlugs = [
        'foundation-mapping',
        'leading-change',
        'culture-core',
        'ai-augmented-leadership',
        'test123',
        'test-123',
        'a',
        '123',
      ];

      validSlugs.forEach(slug => {
        expect(isValidSlugFormat(slug)).toBe(true);
      });
    });

    test('rejects invalid slug formats', () => {
      const invalidSlugs = [
        'Foundation-Mapping',  // uppercase
        'foundation_mapping',  // underscore
        'foundation mapping',  // space
        'foundation--mapping', // double hyphen
        '-foundation-mapping', // leading hyphen
        'foundation-mapping-', // trailing hyphen
        '',                    // empty
        null,                  // null
        undefined,             // undefined
        'foundation.mapping',  // dot
        'foundation+mapping',  // plus
        'foundation/mapping',  // slash
      ];

      invalidSlugs.forEach(slug => {
        expect(isValidSlugFormat(slug)).toBe(false);
      });
    });
  });

  describe('generateSlugFromName', () => {
    test('generates correct slugs from module names', () => {
      const testCases = [
        { name: 'Foundation Mapping', expected: 'foundation-mapping' },
        { name: 'Leading Change', expected: 'leading-change' },
        { name: 'AI-Augmented Leadership', expected: 'ai-augmented-leadership' },
        { name: 'Culture Core', expected: 'culture-core' },
        { name: 'Test   Multiple   Spaces', expected: 'test-multiple-spaces' },
        { name: 'Test!@#$%^&*()Special', expected: 'testspecial' },
        { name: 'Test---Hyphens', expected: 'test-hyphens' },
        { name: '', expected: '' },
      ];

      testCases.forEach(({ name, expected }) => {
        expect(generateSlugFromName(name)).toBe(expected);
      });
    });
  });

  describe('getAllModuleSlugs', () => {
    test('returns array of module slugs', () => {
      const slugs = getAllModuleSlugs();
      
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      
      // All slugs should be strings
      slugs.forEach(slug => {
        expect(typeof slug).toBe('string');
        expect(slug.length).toBeGreaterThan(0);
      });
    });

    test('returns unique slugs only', () => {
      const slugs = getAllModuleSlugs();
      const uniqueSlugs = [...new Set(slugs)];
      
      expect(slugs.length).toBe(uniqueSlugs.length);
    });
  });

  describe('moduleExists', () => {
    test('returns true for existing modules', () => {
      const slugs = getAllModuleSlugs();
      
      // Test first few slugs
      slugs.slice(0, 3).forEach(slug => {
        expect(moduleExists(slug)).toBe(true);
      });
    });

    test('returns false for non-existing modules', () => {
      const nonExistentSlugs = [
        'non-existent-module',
        'fake-module',
        'invalid-slug',
        '',
        null,
        undefined,
      ];

      nonExistentSlugs.forEach(slug => {
        expect(moduleExists(slug)).toBe(false);
      });
    });
  });

  describe('getModuleBySlug', () => {
    test('returns module object for valid slug', () => {
      const slugs = getAllModuleSlugs();
      
      if (slugs.length > 0) {
        const module = getModuleBySlug(slugs[0]);
        
        expect(module).toBeTruthy();
        expect(module).toHaveProperty('name');
        expect(module).toHaveProperty('id');
        expect(module.id).toBe(slugs[0]);
      }
    });

    test('returns null for invalid slug', () => {
      const module = getModuleBySlug('non-existent-module');
      expect(module).toBeNull();
    });
  });

  describe('validateAllModuleUrls', () => {
    test('returns validation report', () => {
      const report = validateAllModuleUrls();
      
      expect(report).toHaveProperty('total');
      expect(report).toHaveProperty('valid');
      expect(report).toHaveProperty('invalid');
      expect(report).toHaveProperty('duplicates');
      expect(report).toHaveProperty('missingIds');
      expect(report).toHaveProperty('invalidFormats');
      expect(report).toHaveProperty('issues');
      
      expect(typeof report.total).toBe('number');
      expect(typeof report.valid).toBe('number');
      expect(typeof report.invalid).toBe('number');
      expect(Array.isArray(report.issues)).toBe(true);
    });

    test('identifies validation issues correctly', () => {
      const report = validateAllModuleUrls();
      
      // Check that totals add up correctly
      expect(report.valid + report.invalid).toBe(report.total);
      
      // Issues should be detailed
      report.issues.forEach(issue => {
        expect(issue).toHaveProperty('type');
        expect(issue).toHaveProperty('message');
        expect(['missing_id', 'duplicate_id', 'invalid_format']).toContain(issue.type);
      });
    });
  });

  describe('testSlugNavigation', () => {
    test('correctly tests valid slug navigation', () => {
      const slugs = getAllModuleSlugs();
      
      if (slugs.length > 0) {
        const result = testSlugNavigation(slugs[0]);
        
        expect(result).toHaveProperty('slug');
        expect(result).toHaveProperty('isValidFormat');
        expect(result).toHaveProperty('moduleExists');
        expect(result).toHaveProperty('canNavigate');
        expect(result).toHaveProperty('module');
        expect(result).toHaveProperty('issues');
        
        expect(result.slug).toBe(slugs[0]);
        expect(result.isValidFormat).toBe(true);
        expect(result.moduleExists).toBe(true);
        expect(result.canNavigate).toBe(true);
        expect(result.module).toBeTruthy();
        expect(result.issues).toHaveLength(0);
      }
    });

    test('correctly identifies invalid slug navigation', () => {
      const result = testSlugNavigation('Invalid-Slug');
      
      expect(result.isValidFormat).toBe(false);
      expect(result.moduleExists).toBe(false);
      expect(result.canNavigate).toBe(false);
      expect(result.module).toBeNull();
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test('handles non-existent but valid format slug', () => {
      const result = testSlugNavigation('valid-format-but-nonexistent');
      
      expect(result.isValidFormat).toBe(true);
      expect(result.moduleExists).toBe(false);
      expect(result.canNavigate).toBe(false);
      expect(result.module).toBeNull();
      expect(result.issues).toContain('Module does not exist');
    });
  });

  describe('getUrlValidationSummary', () => {
    test('returns comprehensive summary', () => {
      const summary = getUrlValidationSummary();
      
      expect(summary).toHaveProperty('totalModules');
      expect(summary).toHaveProperty('validUrls');
      expect(summary).toHaveProperty('invalidUrls');
      expect(summary).toHaveProperty('availableSlugs');
      expect(summary).toHaveProperty('validationReport');
      expect(summary).toHaveProperty('sampleUrls');
      
      expect(typeof summary.totalModules).toBe('number');
      expect(Array.isArray(summary.availableSlugs)).toBe(true);
      expect(Array.isArray(summary.sampleUrls)).toBe(true);
      
      // Sample URLs should be properly formatted
      summary.sampleUrls.forEach(url => {
        expect(url).toMatch(/^\/modules\/[a-z0-9-]+$/);
      });
    });
  });

  describe('Integration Tests', () => {
    test('all existing module slugs are valid format', () => {
      const slugs = getAllModuleSlugs();
      
      slugs.forEach(slug => {
        expect(isValidSlugFormat(slug)).toBe(true);
      });
    });

    test('all modules can be retrieved by their slug', () => {
      const slugs = getAllModuleSlugs();
      
      slugs.forEach(slug => {
        const module = getModuleBySlug(slug);
        expect(module).toBeTruthy();
        expect(module.id).toBe(slug);
      });
    });

    test('validation report shows no critical issues for existing modules', () => {
      const report = validateAllModuleUrls();
      
      // Should have no missing IDs (all modules should have IDs)
      expect(report.missingIds).toBe(0);
      
      // Should have no duplicates
      expect(report.duplicates).toBe(0);
      
      // All existing modules should have valid formats
      expect(report.invalidFormats).toBe(0);
    });
  });
});