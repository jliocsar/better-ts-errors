import {
  translateDiagnosticToMarkdown,
  createTypeScriptErrorsMarkdownTemplate,
  getThemeStyleTag,
  parseMarkdown,
} from './utils'

export type TypeScriptErrorDiagnosticMarkdownOptions = {
  useStyles: boolean
}

export const defaultTypeScriptErrorDiagnosticMarkdownOptions: TypeScriptErrorDiagnosticMarkdownOptions =
  {
    useStyles: true,
  }

export const typeScriptErrorDiagnosticToMarkdown = (
  diagnosticErrorMessage: string,
  createOptions?: TypeScriptErrorDiagnosticMarkdownOptions,
) => {
  const options = {
    ...defaultTypeScriptErrorDiagnosticMarkdownOptions,
    ...createOptions,
  }
  const parsedErrors = translateDiagnosticToMarkdown(diagnosticErrorMessage)
  const errorCount = parsedErrors.length
  const typeScriptErrorsMarkdownTemplate =
    createTypeScriptErrorsMarkdownTemplate(parsedErrors, options)
  const template = options.useStyles
    ? [
        getThemeStyleTag(),
        parseMarkdown(typeScriptErrorsMarkdownTemplate),
      ].join('\n')
    : typeScriptErrorsMarkdownTemplate

  return {
    template,
    errorCount,
    wasInvalidErrorMessage: !errorCount,
  }
}
