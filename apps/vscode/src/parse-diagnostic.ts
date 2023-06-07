import * as vscode from 'vscode'

// TODO: Publish this as a package 🎉
import * as parser from '@better-ts-errors/parser/src'

import type { Options } from './types'

export const parseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  options: Options,
) => {
  const { template } = parser.typeScriptErrorDiagnosticToMarkdown(
    diagnostic.message,
    {
      useStyles: false,
      prettify: options.prettify,
    },
  )
  return new vscode.MarkdownString(template)
}
