import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

import {
  TypeScriptErrorDiagnosticMarkdownOptions,
  defaultTypeScriptErrorDiagnosticMarkdownOptions,
} from '_markdown'

import {
  PROPERTIES_LIST_REGEX,
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
  item.match(/\w+\s\d+\s\w+/) ? `\n${item}...` : `* ${item}`

const createMarkdownList = (list: string) =>
  `\n${list.split(', ').map(createMarkdownItem).join('\n')}`

const translateErrorToMarkdown = (error: string) => {
  const codeBlockedError = error.replace(
    TYPESCRIPT_SNIPPET_REGEX,
    createTypeScriptCodeblock,
  )

  const matchedList = codeBlockedError.match(PROPERTIES_LIST_REGEX)
  if (matchedList) {
    const [originalList, commaSeparatedList] = matchedList
    return codeBlockedError.replace(
      originalList,
      createMarkdownList(commaSeparatedList),
    )
  }

  return codeBlockedError
}

export const parseMarkdown = (markdown: string) => renderer.render(markdown)

export const createTypeScriptErrorMarkdownTemplate = (
  errors: string[],
  options: TypeScriptErrorDiagnosticMarkdownOptions = defaultTypeScriptErrorDiagnosticMarkdownOptions,
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

export const createTypeScriptCodeblock = (code: string) => {
  const snippet = code.replace(/'/g, '')
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}

export const translateDiagnosticToMarkdown = (errorMessage: string) => {
  const errors = errorMessage.replace(/\.$/, '').split(/(?<!\.)\.(?!\.)/g)
  return errors.map(translateErrorToMarkdown)
}
