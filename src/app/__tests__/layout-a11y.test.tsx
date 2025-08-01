import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Layout from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}))

describe('Application A11y Tests', () => {
  describe('Layout Component', () => {
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
          'form-field-multiple-labels': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-one-main': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'region': { enabled: true },
          'skip-link': { enabled: true },
          'link-name': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })

  describe('Layout with complex content', () => {
    it('should not have accessibility violations with complex content', async () => {
      const { container } = render(
        <ThemeProvider>
          <Layout>
            <section>
              <h2>Section Heading</h2>
              <p>Some content with <a href="/link">a link</a>.</p>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
              </ul>
              <form>
                <label htmlFor="test-input">Test Label</label>
                <input id="test-input" type="text" />
                <button type="submit">Submit</button>
              </form>
            </section>
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
          'link-name': { enabled: true },
        },
      })
      
      expect(results.violations).toHaveLength(0)
    })
  })
}) 