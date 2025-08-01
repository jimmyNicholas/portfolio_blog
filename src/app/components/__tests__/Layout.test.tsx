import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Layout from '../Layout'
import { ThemeProvider } from '../ThemeProvider'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('Layout Component A11y', () => {
  describe('Layout with children', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <Layout>
            <div>Test content</div>
          </Layout>
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
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
          'skip-link': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })

  describe('Layout with complex children', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <Layout>
            <main>
              <h2>Section Heading</h2>
              <section>
                <h3>Subsection Heading</h3>
                <p>Some content</p>
              </section>
            </main>
          </Layout>
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
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
          'skip-link': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })

  describe('Layout with form elements', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <ThemeProvider>
          <Layout>
            <form>
              <label htmlFor="test-input">Test Label</label>
              <input id="test-input" type="text" />
              <button type="submit">Submit</button>
            </form>
          </Layout>
        </ThemeProvider>
      )
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'button-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
          'skip-link': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 