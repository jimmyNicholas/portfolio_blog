# Accessibility Testing Setup

This project uses axe-core with Jest for automated accessibility testing. The setup focuses on detecting common accessibility violations without testing basic rendering functionality.

## Setup

The following packages have been installed:
- `jest` - Testing framework
- `jest-environment-jsdom` - DOM environment for Jest
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `axe-core` - Accessibility testing engine
- `@axe-core/react` - React integration for axe-core
- `jest-axe` - Jest integration for axe-core
- `@types/jest` - TypeScript definitions for Jest
- `canvas` - Canvas support for color contrast analysis

## Test Structure

Tests are organized in `__tests__` folders:
- `src/app/__tests__/` - Page-level tests, utilities, and types
- `src/app/components/__tests__/` - Component-level tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only a11y tests
npm run test:a11y

# Run specific test files
npm test -- --testPathPatterns=Navigation.test.tsx
```

## Current Test Coverage

### ✅ Working Tests
- **Navigation Component** - Tests both home and non-home page variants
- **About Page** - Tests content accessibility
- **Work Page** - Tests project grid and links accessibility

### ✅ Working Tests
- **Navigation Component** - Tests both home and non-home page variants
- **Layout Component** - Tests with various content types (fixed theme context issues)
- **SocialLinks Component** - Tests social media links (fixed SVG accessibility)
- **ModeToggle Component** - Tests theme and style toggles (fixed theme context issues)
- **About Page** - Tests content accessibility
- **Work Page** - Tests project grid and links accessibility
- **Application Layout** - Tests layout component with complex content (fixed HTML nesting issues)

### 🎯 Key Accessibility Rules Tested

- **Color Contrast** - Ensures sufficient color contrast ratios
- **Button Names** - Verifies buttons have accessible names
- **Form Field Labels** - Checks for proper form labeling
- **Heading Order** - Validates logical heading hierarchy
- **Landmarks** - Ensures proper semantic structure
- **Lists** - Verifies proper list markup
- **Page Structure** - Checks for main landmarks and headings
- **Links** - Ensures links have descriptive text
- **Document Structure** - Validates HTML lang attributes and titles

## Real Issues Found and Fixed

The tests have identified and we've fixed accessibility issues:

### ✅ SVG Icon Accessibility (FIXED)
The SocialLinks component was using SVG icons without proper accessibility attributes. The test detected:
- Missing `title` elements
- Missing `aria-label` attributes
- Missing `aria-labelledby` attributes

**Fix applied**: Added `aria-label` attributes to all SVG icons in the SocialLinks component.

### ✅ Page Heading Structure (FIXED)
The Layout component was missing a level-one heading (`<h1>`), which is required for proper document structure.

**Fix applied**: Added a hidden `<h1>` element with the page title "Jimmy Nicholas - Developer, Educator, and Musician" using the `sr-only` class for screen readers while preserving the visual design.

## Test Implementation

Tests use a simple pattern:

```typescript
import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ThemeProvider } from '../components/ThemeProvider'

describe('Component A11y', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    )
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'button-name': { enabled: true },
        // ... other rules
      },
    })
    
    expect(results.violations).toHaveLength(0)
  })
})
```

## Next Steps

1. **Add more comprehensive tests** - Test different theme modes and states
2. **Integrate with CI/CD** - Add a11y tests to build pipeline
3. **Monitor for new issues** - Run tests regularly to catch accessibility regressions
4. **Fix Jest configuration** - Resolve the `moduleNameMapping` warning

## Integration with Development

The tests are designed to run quickly and focus on accessibility violations rather than basic functionality. They complement manual testing with browser-based accessibility tools like axe DevTools.

## Notes

- Canvas support is now properly configured for color contrast analysis
- Some React warnings about unknown props (like `whileHover`) are from Framer Motion and don't affect a11y
- Tests focus on core accessibility issues rather than rendering functionality 