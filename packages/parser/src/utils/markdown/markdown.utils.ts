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

const replaceErrorPartsByMarkdown = (errorMessage: string) => {
  let result = errorMessage

  const matchedList = errorMessage.match(PROPERTIES_LIST_REGEX)
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
  (errorMessage: string, index: number) => {
    const errorPosition = index + 1
    return `
${
  options.useStyles
    ? `### Error ${errorPosition}`
    : `**Error #${errorPosition}:**`
}

${errorMessage}
${!options.useStyles ? '\n---' : ''}
`
  }

const higienizeErrorCandidate = (errorCandidate: string) =>
  !errorCandidate.endsWith(' ')

const mapErrorsToMarkdown = (errorMessage: string, errors: string[]) =>
  [...new Set(errors)].reduce(
    (result, error) => result.replace(`'${error}'`, createTypeScriptCodeblock),
    errorMessage,
  )

const translateErrorToMarkdown = (errorMessage: string) => {
  const errorCandidates = errorMessage
    .match(TYPESCRIPT_SNIPPET_REGEX)
    ?.filter(higienizeErrorCandidate)

  if (!errorCandidates) {
    return errorMessage
  }

  const codeBlockedError = mapErrorsToMarkdown(errorMessage, errorCandidates)
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
  const higienizedErrorMessage = errorMessage
    .replace(/\.$/, '')
    .replace(/|\s{2,}/, '')
  const errors = higienizedErrorMessage.split(TYPESCRIPT_ERROR_BOUNDARY)

  return errors.map(translateErrorToMarkdown)
}
