import * as vscode from 'vscode'

// TODO: Publish this as a package 🎉
import * as parser from '@better-ts-errors/parser/src'

import type { Options } from './types'

export const parseDiagnostic = async (
  diagnostic: vscode.Diagnostic,
  options: Options,
) => {
  try {
    const { template } = await parser.typeScriptErrorDiagnosticToMarkdown(
      diagnostic.code as number,
      diagnostic.message,
      {
        useStyles: false,
        prettify: options.prettify,
      },
    )
    return new vscode.MarkdownString(template)
  } catch (error) {
    console.error((error as Error).message)
    return null
  }
}
