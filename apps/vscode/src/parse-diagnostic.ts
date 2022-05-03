import * as vscode from 'vscode'

import * as parser from '@better-ts-errors/parser/src'

import type { Options } from './types'

export const parseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  _options: Options,
) => {
  const { template } = parser.createTypeScriptErrorMarkdown(diagnostic.message)

  return new vscode.MarkdownString(template)
}
