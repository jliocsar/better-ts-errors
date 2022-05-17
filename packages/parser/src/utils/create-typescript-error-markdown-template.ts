import {
  CreateTypeScriptErrorMarkdownOptions,
  defaultCreateTypeScriptErrorMarkdownOptions,
} from '../markdown'

export const createTypeScriptErrorMarkdownTemplate = (
  errors: string[],
  options: CreateTypeScriptErrorMarkdownOptions = defaultCreateTypeScriptErrorMarkdownOptions,
) =>
  errors
    .map((error, index) => {
      const errorPosition = index + 1
      return `
${
  options.useStyles
    ? `### Error ${errorPosition}`
    : `**Error ${errorPosition}:**`
}

${error}
${!options.useStyles ? '\n---' : ''}
`
    })
    .join('\n')
