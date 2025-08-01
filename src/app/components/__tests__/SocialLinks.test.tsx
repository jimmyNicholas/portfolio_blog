import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import SocialLinks from '../SocialLinks'
import { ThemeProvider } from '../ThemeProvider'

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true,
})

describe('SocialLinks Component A11y', () => {
  describe('Social Links', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <SocialLinks />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: true },
          'color-contrast': { enabled: true },
          'landmark-one-main': { enabled: true },
          'link-name': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 