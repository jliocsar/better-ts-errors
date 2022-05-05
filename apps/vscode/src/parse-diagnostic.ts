import * as vscode from 'vscode'

// TODO: Publish this as a package 🎉
import * as parser from '@better-ts-errors/parser/src'

import type { Options } from './types'

export const parseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  _options: Options,
) => {
  if (diagnostic.source !== 'ts') {
    return null
  }

  const { template } = parser.createTypeScriptErrorMarkdown(
    diagnostic.message,
    {
      useStyles: false,
    },
  )

  return new vscode.MarkdownString(template)
}
