declare module 'jest-axe' {
  export function axe(
    container: Element | Document,
    options?: {
      rules?: Record<string, any>
      runOnly?: {
        type: 'rule' | 'ruleId' | 'tag'
        values: string[]
      }
    }
  ): Promise<{
    violations: Array<{
      id: string
      impact: string
      description: string
      help: string
      helpUrl: string
      tags: string[]
      nodes: Array<{
        html: string
        target: string[]
        failureSummary: string
      }>
    }>
  }>
} 