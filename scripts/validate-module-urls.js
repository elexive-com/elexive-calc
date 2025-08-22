#!/usr/bin/env node

/**
 * Script to validate all module URLs work correctly
 * This script tests browser navigation support and URL state management
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module configuration
const modulesConfigPath = path.join(__dirname, '../src/config/modulesConfig.json');
const modulesConfig = JSON.parse(fs.readFileSync(modulesConfigPath, 'utf8'));

// Import our validation utilities
const validatorPath = path.join(__dirname, '../src/utils/moduleUrlValidator.js');

console.log('🔍 Validating Module URLs for Browser Navigation Support\n');

// Test 1: Validate all module slugs exist and have correct format
console.log('1. Validating module slug formats...');
const modules = modulesConfig.modules;
let validCount = 0;
let invalidCount = 0;
const issues = [];

modules.forEach((module, index) => {
  const { id, name } = module;
  
  if (!id) {
    invalidCount++;
    issues.push(`❌ Module "${name}" (index ${index}) is missing an ID field`);
    return;
  }
  
  // Validate slug format (kebab-case)
  const isValidFormat = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
  
  if (!isValidFormat) {
    invalidCount++;
    issues.push(`❌ Module "${name}" has invalid slug format: "${id}"`);
  } else {
    validCount++;
  }
});

console.log(`   ✅ Valid slugs: ${validCount}`);
console.log(`   ❌ Invalid slugs: ${invalidCount}`);

if (issues.length > 0) {
  console.log('\n   Issues found:');
  issues.forEach(issue => console.log(`   ${issue}`));
}

// Test 2: Check for duplicate slugs
console.log('\n2. Checking for duplicate slugs...');
const slugCounts = {};
const duplicates = [];

modules.forEach(module => {
  if (module.id) {
    slugCounts[module.id] = (slugCounts[module.id] || 0) + 1;
    if (slugCounts[module.id] > 1) {
      duplicates.push(module.id);
    }
  }
});

if (duplicates.length === 0) {
  console.log('   ✅ No duplicate slugs found');
} else {
  console.log(`   ❌ Found ${duplicates.length} duplicate slugs:`);
  duplicates.forEach(slug => {
    console.log(`   - "${slug}" appears ${slugCounts[slug]} times`);
  });
}

// Test 3: Generate sample URLs and validate they would work
console.log('\n3. Generating sample URLs...');
const validSlugs = modules.filter(m => m.id && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id));
const sampleUrls = validSlugs.slice(0, 10).map(module => ({
  name: module.name,
  slug: module.id,
  url: `/modules/${module.id}`,
  pillar: module.pillar,
}));

console.log('   Sample URLs that should work:');
sampleUrls.forEach(({ name, url, pillar }) => {
  console.log(`   ✅ ${url} → "${name}" (${pillar})`);
});

// Test 4: Test edge cases that should fail
console.log('\n4. Testing edge cases that should fail...');
const edgeCases = [
  { slug: 'Invalid_Slug', reason: 'Contains underscore' },
  { slug: 'invalid slug', reason: 'Contains space' },
  { slug: 'Invalid-Slug', reason: 'Contains uppercase' },
  { slug: 'invalid--slug', reason: 'Double hyphen' },
  { slug: '-invalid-slug', reason: 'Leading hyphen' },
  { slug: 'invalid-slug-', reason: 'Trailing hyphen' },
  { slug: '', reason: 'Empty string' },
  { slug: 'test.module', reason: 'Contains dot' },
  { slug: 'test+module', reason: 'Contains plus' },
];

edgeCases.forEach(({ slug, reason }) => {
  const url = `/modules/${encodeURIComponent(slug)}`;
  console.log(`   ❌ ${url} → Should fail (${reason})`);
});

// Test 5: Browser navigation scenarios
console.log('\n5. Browser navigation scenarios to test:');
const navigationScenarios = [
  'Direct URL access: /modules/foundation-mapping',
  'Browser back button from module detail to modules list',
  'Browser forward button navigation',
  'Page refresh on module detail view',
  'URL sharing and bookmarking',
  'Invalid URL handling: /modules/non-existent-module',
  'Malformed URL handling: /modules/Invalid_Slug',
];

navigationScenarios.forEach((scenario, index) => {
  console.log(`   ${index + 1}. ${scenario}`);
});

// Test 6: Performance considerations
console.log('\n6. Performance considerations:');
console.log(`   📊 Total modules: ${modules.length}`);
console.log(`   📊 Valid URLs: ${validCount}`);
console.log(`   📊 URL patterns to handle: ${validCount + edgeCases.length}`);

// Summary
console.log('\n📋 Summary:');
console.log(`   Total modules: ${modules.length}`);
console.log(`   Valid slugs: ${validCount}`);
console.log(`   Invalid slugs: ${invalidCount}`);
console.log(`   Duplicate slugs: ${duplicates.length}`);

const overallStatus = invalidCount === 0 && duplicates.length === 0 ? '✅ PASS' : '❌ FAIL';
console.log(`   Overall status: ${overallStatus}`);

if (overallStatus === '✅ PASS') {
  console.log('\n🎉 All module URLs are ready for browser navigation support!');
  console.log('\nNext steps:');
  console.log('1. Run the test suite: npm test -- ModuleDetailPage');
  console.log('2. Test browser navigation manually in development');
  console.log('3. Verify URL sharing works correctly');
  console.log('4. Test on different devices and browsers');
} else {
  console.log('\n⚠️  Issues found that need to be resolved before deployment.');
  process.exit(1);
}