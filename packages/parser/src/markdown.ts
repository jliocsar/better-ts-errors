import {
  translateDiagnosticToMarkdown,
  getThemeStyleTag,
  parseMarkdown,
  createTypeScriptErrorMarkdownTemplate,
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

export const typeScriptErrorDiagnosticToMarkdown = async (
  diagnosticCode: number,
  diagnosticErrorMessage: string,
  createOptions?: TypeScriptErrorDiagnosticMarkdownOptions,
) => {
  const options = {
    ...defaultTypeScriptErrorDiagnosticMarkdownOptions,
    ...createOptions,
  }
  const parsedError = await translateDiagnosticToMarkdown(
    diagnosticCode,
    diagnosticErrorMessage,
  )
  if (!parsedError) {
    throw new Error(`Failed to parse error "${diagnosticErrorMessage}"`)
  }
  const typeScriptErrorsMarkdownTemplate =
    createTypeScriptErrorMarkdownTemplate(options)(diagnosticCode, parsedError)
  const template = options.useStyles
    ? [
        getThemeStyleTag(),
        parseMarkdown(typeScriptErrorsMarkdownTemplate),
      ].join('\n')
    : typeScriptErrorsMarkdownTemplate

  return {
    template,
  }
}
