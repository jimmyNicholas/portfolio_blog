import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import ModeToggle from '../ModeToggle'
import { ThemeProvider } from '../ThemeProvider'

describe('ModeToggle Component A11y', () => {
  describe('Mode Toggle', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <ModeToggle />
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: true },
          'color-contrast': { enabled: true },
          'landmark-one-main': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 