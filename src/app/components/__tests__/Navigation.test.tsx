import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Navigation from '../Navigation'
import { ThemeProvider } from '../ThemeProvider'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('Navigation Component A11y', () => {
  const defaultProps = {
    isBusinessMode: false,
    isDarkMode: false,
    foregroundEffectStyles: {
      container: {},
      overlay: {},
    },
    isHomePage: true,
  }

  describe('Home Page Navigation', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <Navigation {...defaultProps} />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'button-name': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })

  describe('Non-Home Page Navigation', () => {
    it('should not have accessibility violations', async () => {
      const nonHomeProps = {
        ...defaultProps,
        isHomePage: false,
      }

      const { container } = render(
        <ThemeProvider>
          <Navigation {...nonHomeProps} />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'button-name': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 