import { getThemeStyleTag } from './utils/get-theme-style-tag'
import { createTypeScriptErrorMarkdownTemplate } from './utils/create-typescript-error-markdown-template'
import { parseErrorMessage } from './utils/parse-error-message'
import { parseMarkdown } from './utils/parse-markdown'

export type CreateTypeScriptErrorMarkdownOptions = {
  useStyles: boolean
}

export const defaultCreateTypeScriptErrorMarkdownOptions: CreateTypeScriptErrorMarkdownOptions =
  {
    useStyles: true,
  }

export const createTypeScriptErrorMarkdown = (
  errorMessage: string,
  createOptions?: CreateTypeScriptErrorMarkdownOptions,
) => {
  const options = {
    ...defaultCreateTypeScriptErrorMarkdownOptions,
    ...createOptions,
  }
  const parsedErrors = parseErrorMessage(errorMessage)
  const errorCount = parsedErrors.length
  const typeScriptErrorsMarkdownTemplate =
    createTypeScriptErrorMarkdownTemplate(parsedErrors, options)
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
