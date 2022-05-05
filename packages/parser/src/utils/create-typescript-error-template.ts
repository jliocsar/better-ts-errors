import type { CreateTypeScriptErrorMarkdownOptions } from '../markdown'

export const createTypeScriptErrorTemplate = (
  errors: string[],
  options?: CreateTypeScriptErrorMarkdownOptions,
) =>
  errors
    .map((error, index) => {
      const errorPosition = index + 1
      return `
${
  options?.useStyles
    ? `### Error ${errorPosition}`
    : `**Error ${errorPosition}:**`
}

${error}
${!options?.useStyles ? '\n---' : ''}
`
    })
    .join('\n')
