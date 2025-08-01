import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import AboutPage from '../about/page'
import WorkPage from '../work/page'
import { ThemeProvider } from '../components/ThemeProvider'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode, [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}))

describe('Page A11y Tests', () => {
  describe('About Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <AboutPage />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })

  describe('Work Page', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <WorkPage />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
          'link-name': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 