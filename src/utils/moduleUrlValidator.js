import modulesConfig from '../config/modulesConfig.json';

/**
 * Utility functions for validating and testing module URLs
 */

/**
 * Get all available module slugs from configuration
 * @returns {string[]} Array of module slugs
 */
export const getAllModuleSlugs = () => {
  return modulesConfig.modules.map(module => module.id).filter(Boolean);
};

/**
 * Validate if a slug follows the correct format
 * @param {string} slug - The slug to validate
 * @returns {boolean} True if valid format
 */
export const isValidSlugFormat = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  
  // Must be kebab-case: lowercase letters, numbers, and hyphens only
  // Cannot start or end with hyphen, no consecutive hyphens
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
};

/**
 * Check if a module exists by slug
 * @param {string} slug - The slug to check
 * @returns {boolean} True if module exists
 */
export const moduleExists = (slug) => {
  return modulesConfig.modules.some(module => module.id === slug);
};

/**
 * Get module by slug
 * @param {string} slug - The slug to find
 * @returns {object|null} Module object or null if not found
 */
export const getModuleBySlug = (slug) => {
  return modulesConfig.modules.find(module => module.id === slug) || null;
};

/**
 * Validate all module URLs and return report
 * @returns {object} Validation report
 */
export const validateAllModuleUrls = () => {
  const modules = modulesConfig.modules;
  const report = {
    total: modules.length,
    valid: 0,
    invalid: 0,
    duplicates: 0,
    missingIds: 0,
    invalidFormats: 0,
    issues: [],
  };

  const seenIds = new Set();
  const duplicateIds = new Set();

  modules.forEach((module, index) => {
    const { id, name } = module;

    // Check for missing ID
    if (!id) {
      report.missingIds++;
      report.issues.push({
        type: 'missing_id',
        module: name,
        index,
        message: `Module "${name}" is missing an ID field`,
      });
      return;
    }

    // Check for duplicate IDs
    if (seenIds.has(id)) {
      if (!duplicateIds.has(id)) {
        report.duplicates++;
        duplicateIds.add(id);
      }
      report.issues.push({
        type: 'duplicate_id',
        module: name,
        id,
        index,
        message: `Duplicate ID "${id}" found in module "${name}"`,
      });
    } else {
      seenIds.add(id);
    }

    // Check slug format
    if (!isValidSlugFormat(id)) {
      report.invalidFormats++;
      report.issues.push({
        type: 'invalid_format',
        module: name,
        id,
        index,
        message: `Invalid slug format "${id}" in module "${name}". Should be kebab-case.`,
      });
    } else {
      report.valid++;
    }
  });

  report.invalid = report.missingIds + report.duplicates + report.invalidFormats;

  return report;
};

/**
 * Generate suggested slug from module name
 * @param {string} name - Module name
 * @returns {string} Suggested slug
 */
export const generateSlugFromName = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
};

/**
 * Test all module URLs for accessibility
 * @returns {Promise<object>} Test results
 */
export const testAllModuleUrls = async () => {
  const slugs = getAllModuleSlugs();
  const results = {
    total: slugs.length,
    accessible: 0,
    inaccessible: 0,
    errors: [],
  };

  for (const slug of slugs) {
    try {
      const module = getModuleBySlug(slug);
      if (module) {
        results.accessible++;
      } else {
        results.inaccessible++;
        results.errors.push({
          slug,
          error: 'Module not found',
        });
      }
    } catch (error) {
      results.inaccessible++;
      results.errors.push({
        slug,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Get URL validation summary for debugging
 * @returns {object} Summary information
 */
export const getUrlValidationSummary = () => {
  const validation = validateAllModuleUrls();
  const slugs = getAllModuleSlugs();
  
  return {
    totalModules: validation.total,
    validUrls: validation.valid,
    invalidUrls: validation.invalid,
    availableSlugs: slugs,
    validationReport: validation,
    sampleUrls: slugs.slice(0, 5).map(slug => `/modules/${slug}`),
  };
};

/**
 * Check if URL navigation would work for a given slug
 * @param {string} slug - The slug to test
 * @returns {object} Navigation test result
 */
export const testSlugNavigation = (slug) => {
  const result = {
    slug,
    isValidFormat: isValidSlugFormat(slug),
    moduleExists: moduleExists(slug),
    canNavigate: false,
    module: null,
    issues: [],
  };

  if (!result.isValidFormat) {
    result.issues.push('Invalid slug format - must be kebab-case');
  }

  if (!result.moduleExists) {
    result.issues.push('Module does not exist');
  } else {
    result.module = getModuleBySlug(slug);
  }

  result.canNavigate = result.isValidFormat && result.moduleExists;

  return result;
};

export default {
  getAllModuleSlugs,
  isValidSlugFormat,
  moduleExists,
  getModuleBySlug,
  validateAllModuleUrls,
  generateSlugFromName,
  testAllModuleUrls,
  getUrlValidationSummary,
  testSlugNavigation,
};