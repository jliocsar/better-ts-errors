import * as vscode from 'vscode'

import {
  type TFormatOptions,
  type TTypeScriptDiagnosticMessageFormatter,
  loadDiagnosticMessages,
  createTypeScriptErrorMarkdownTemplateFactory,
  createTypeScriptDiagnosticMessageFormatter,
} from '@better-ts-errors/formatter'

type TUriStoreValue = {
  range: vscode.Range
  contents: string[]
}
type TVSCodeDiagnosticFormatter = (
  errorIndex: number,
  diagnostic: vscode.Diagnostic,
  options?: TFormatOptions,
) => string | null

const EXTENSION_OPTION_KEY = 'betterTypeScriptErrors'
const defaultOptions: TFormatOptions = {
  prettify: false,
}

let uriStore: Record<vscode.Uri['path'], TUriStoreValue[]> = {}
let options = defaultOptions

const updateOptions = () => {
  options = {
    ...defaultOptions,
    ...vscode.workspace.getConfiguration(EXTENSION_OPTION_KEY),
  }
}

const provideHover: vscode.HoverProvider['provideHover'] = (
  document,
  position,
) => {
  const itemsInUriStore = uriStore[document.uri.path]
  if (!itemsInUriStore) {
    return null
  }
  const itemInRange = itemsInUriStore.find(item =>
    item.range.contains(position),
  )
  return itemInRange
}

export const createVSCodeTypeScriptDiagnosticParser =
  (
    formatTypeScriptDiagnosticMessage: TTypeScriptDiagnosticMessageFormatter,
  ): TVSCodeDiagnosticFormatter =>
  (errorIndex, diagnostic, { prettify = false } = {}) => {
    try {
      const createTemplate = createTypeScriptErrorMarkdownTemplateFactory(
        formatTypeScriptDiagnosticMessage,
      )
      const template = createTemplate(errorIndex, diagnostic, { prettify })
      if (!template) {
        return null
      }
      return template
    } catch (error) {
      console.error((error as Error).message)
      return null
    }
  }

const handleDiagnosticsChange =
  (formatVSCodeDiagnosticMessage: TVSCodeDiagnosticFormatter) =>
  async (event: vscode.DiagnosticChangeEvent) => {
    if (!('uris' in event) || !event.uris.length) {
      return
    }
    uriStore = {}
    const { uris } = event

    for (const uri of uris) {
      const items: TUriStoreValue[] = []
      const diagnostics = vscode.languages.getDiagnostics(uri)
      const diagnosticsLength = diagnostics.length

      for (let errorIndex = 0; errorIndex < diagnosticsLength; errorIndex++) {
        try {
          const diagnostic = diagnostics[errorIndex]
          if (!('source' in diagnostic) || diagnostic.source !== 'ts') {
            continue
          }
          const errorMarkdown = formatVSCodeDiagnosticMessage(
            errorIndex,
            diagnostic,
            options,
          )
          if (errorMarkdown) {
            const existingRangeIndex = items.findIndex(item =>
              item.range.isEqual(diagnostic.range),
            )
            if (~existingRangeIndex) {
              items[existingRangeIndex].contents.push(errorMarkdown)
            } else {
              items.push({
                range: diagnostic.range,
                contents: [errorMarkdown],
              })
            }
          }
        } catch (error) {
          console.error((error as Error).message)
        }
      }

      uriStore[uri.path] = items
    }
  }

const handleConfigurationChange = (event: vscode.ConfigurationChangeEvent) => {
  if (event.affectsConfiguration(EXTENSION_OPTION_KEY)) {
    updateOptions()
  }
}

let DMap = null

export const activate = async (context: vscode.ExtensionContext) => {
  console.info('Activating `better-ts-errors`')
  updateOptions()
  DMap ??= await loadDiagnosticMessages()
  const formatTypeScriptDiagnosticMessage =
    createTypeScriptDiagnosticMessageFormatter(DMap)
  const formatVSCodeDiagnosticMessage = createVSCodeTypeScriptDiagnosticParser(
    formatTypeScriptDiagnosticMessage,
  )

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['typescript', 'typescriptreact'], {
      provideHover,
    }),
    vscode.workspace.onDidChangeConfiguration(handleConfigurationChange),
    vscode.languages.onDidChangeDiagnostics(
      handleDiagnosticsChange(formatVSCodeDiagnosticMessage),
    ),
  )
}

export const deactivate = () => {
  console.info('Deactivating `better-ts-errors`')
}
