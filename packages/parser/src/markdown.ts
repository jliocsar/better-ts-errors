import { getThemeStyleTag } from './utils/get-theme-style-tag'
import { createTypeScriptErrorTemplate } from './utils/create-typescript-error-template'
import { parseErrorMessage } from './utils/parse-error-message'
import { parseMarkdown } from './utils/parse-markdown'

export type CreateTypeScriptErrorMarkdownOptions = {
  useStyles?: boolean
}

const defaultCreateTypeScriptErrorMarkdownOptions: CreateTypeScriptErrorMarkdownOptions =
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
  const typeScriptErrorsTemplate = createTypeScriptErrorTemplate(
    parsedErrors,
    options,
  )
  const template = options.useStyles
    ? [getThemeStyleTag(), parseMarkdown(typeScriptErrorsTemplate)].join('\n')
    : typeScriptErrorsTemplate

  return {
    template,
    errorCount,
    wasInvalidErrorMessage: !errorCount,
  }
}
