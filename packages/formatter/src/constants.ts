import * as path from 'path'

import ts from 'typescript'
import * as vscode from 'vscode'

export const ROOT = path.resolve(__dirname, '../../..')

export const DiagnosticSeverity = vscode.DiagnosticSeverity
export type TDiagnosticSeverity = typeof DiagnosticSeverity

export const CategoryIconMap: {
  [Category in keyof typeof ts.DiagnosticCategory]?: string
} = {
  [DiagnosticSeverity.Warning]: '⚠️',
  [DiagnosticSeverity.Error]: '🛑',
  [DiagnosticSeverity.Hint]: '🙋‍♀️',
  [DiagnosticSeverity.Information]: '🦥',
} as const
