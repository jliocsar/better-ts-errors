import {
  translateDiagnosticToMarkdown,
  createTypeScriptErrorsMarkdownTemplate,
  getThemeStyleTag,
  parseMarkdown,
} from './utils'

export type TypeScriptErrorDiagnosticMarkdownOptions = {
  useStyles: boolean
  prettify?: boolean
}

export const defaultTypeScriptErrorDiagnosticMarkdownOptions: TypeScriptErrorDiagnosticMarkdownOptions =
  {
    useStyles: true,
    prettify: false,
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
