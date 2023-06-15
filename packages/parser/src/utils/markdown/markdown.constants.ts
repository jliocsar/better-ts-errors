import ts from 'typescript'

export const TYPESCRIPT_ERROR_BOUNDARY = /\n\s+/g

export const categoryIconMap: {
  [Category in keyof typeof ts.DiagnosticCategory]?: string
} = {
  Warning: '⚠️',
  Error: '🛑',
  Suggestion: '🙋‍♀️',
  Message: '🦥',
} as const
