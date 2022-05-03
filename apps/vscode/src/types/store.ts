import * as vscode from 'vscode'

export type UriStoreValue = {
  range: vscode.Range
  contents: vscode.MarkdownString[]
}
