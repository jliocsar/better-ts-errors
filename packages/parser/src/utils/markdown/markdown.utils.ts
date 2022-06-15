import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

import {
  TypeScriptErrorDiagnosticMarkdownOptions,
  defaultTypeScriptErrorDiagnosticMarkdownOptions,
} from '_markdown'

import {
  OBJECT_PROPERTIES_AND_REGEX,
  PROPERTIES_LIST_REGEX,
  TYPESCRIPT_ERROR_BOUNDARY,
  TYPESCRIPT_SNIPPET_REGEX,
} from './markdown.constants'

const renderer = new MarkdownIt({
  html: true,
  highlight: (code: string, language: string) => {
    if (language && hljs.getLanguage(language)) {
      const { value } = hljs.highlight(code, {
        language,
      })

      return value
    }

    return code
  },
})

const createMarkdownItem = (item: string) =>
  item.match(OBJECT_PROPERTIES_AND_REGEX) ? `\n${item}...` : `* ${item}`

const createMarkdownList = (list: string) =>
  `\n${list.split(', ').map(createMarkdownItem).join('\n')}`

const replaceErrorPartsByMarkdown = (error: string) => {
  let result = error

  const matchedList = error.match(PROPERTIES_LIST_REGEX)
  if (matchedList) {
    const [originalList, commaSeparatedList] = matchedList
    result = result.replace(
      originalList,
      createMarkdownList(commaSeparatedList),
    )
  }

  return result
}

const createTypeScriptErrorMarkdownTemplate =
  (
    options: TypeScriptErrorDiagnosticMarkdownOptions = defaultTypeScriptErrorDiagnosticMarkdownOptions,
  ) =>
  (error: string, index: number) => {
    const errorPosition = index + 1
    return `
${
  options.useStyles
    ? `### Error ${errorPosition}`
    : `**Error #${errorPosition}:**`
}

${error}
${!options.useStyles ? '\n---' : ''}
`
  }

const translateErrorToMarkdown = (error: string) => {
  const codeBlockedError = error.replace(
    TYPESCRIPT_SNIPPET_REGEX,
    createTypeScriptCodeblock,
  )
  return replaceErrorPartsByMarkdown(codeBlockedError)
}

export const parseMarkdown = (markdown: string) => renderer.render(markdown)

export const createTypeScriptErrorsMarkdownTemplate = (
  errors: string[],
  options: TypeScriptErrorDiagnosticMarkdownOptions,
) => errors.map(createTypeScriptErrorMarkdownTemplate(options)).join('\n')

export const createTypeScriptCodeblock = (code: string) => {
  const snippet = code.replace(/'/g, '')
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}

export const translateDiagnosticToMarkdown = (errorMessage: string) => {
  const errors = errorMessage
    .replace(/\.$/, '')
    .split(TYPESCRIPT_ERROR_BOUNDARY)
  return errors.map(translateErrorToMarkdown)
}
