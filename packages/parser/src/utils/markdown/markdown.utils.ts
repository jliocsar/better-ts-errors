import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import ts from 'typescript'
import { request } from 'undici'
import escapeStringRegexp from 'escape-string-regexp'

import {
  TypeScriptErrorDiagnosticMarkdownOptions,
  defaultTypeScriptErrorDiagnosticMarkdownOptions,
} from '../../markdown'

import {
  TYPESCRIPT_ERROR_BOUNDARY,
  categoryIconMap,
} from './markdown.constants'

type TypeScriptErrorMatch = {
  category: ts.DiagnosticCategory
  template: string
  match: RegExp
}
let diagnosticMessages: Map<number, TypeScriptErrorMatch> | null = null

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
export const parseMarkdown = (markdown: string) => renderer.render(markdown)

const createTypeScriptErrorMarkdownTemplate =
  (
    options: TypeScriptErrorDiagnosticMarkdownOptions = defaultTypeScriptErrorDiagnosticMarkdownOptions,
  ) =>
  (
    error: {
      category: ts.DiagnosticCategory
      markdown: string
    },
    index: number,
  ) => {
    const { markdown: errorMarkdown, category } = error
    const errorPosition = index + 1
    const { prettify, useStyles } = options
    let title = `**Error #${errorPosition}:**`

    if (useStyles) {
      title = `### Error ${errorPosition}`
    } else if (prettify) {
      const icon = categoryIconMap[category] ?? categoryIconMap.Message
      title = `**\`${icon} Error #${errorPosition}\`**`
    }

    return `
${title}

${errorMarkdown}

${!options.useStyles ? '\n---' : ''}
`.trim()
  }

const translateErrorToMarkdown = (
  errorMatch: TypeScriptErrorMatch,
  errorMessage: string,
) => {
  const { match, template } = errorMatch
  const matchResult = errorMessage.matchAll(match)
  if (!matchResult) {
    throw new Error('Invalid error message provided')
  }
  const [matched] = [...matchResult]
  const [, ...snippets] = matched
  return removeTrailingDot(template)
    .replace(/'\{\d\}'/g, value => {
      const index = Number(value.replace(/['\{\}]/g, ''))
      return createTypeScriptCodeblock(snippets[index].toString())
    })
    .replace(/'\w+'/g, createTypeScriptCodeblock)
}

const fetchDiagnosticMessages = async () => {
  const { statusCode, body } = await request(
    `https://raw.githubusercontent.com/microsoft/TypeScript/v${ts.version.toString()}/src/compiler/diagnosticMessages.json`,
  )
  if (statusCode !== 200) {
    throw new Error('Failed to fetch diagnostic messages')
  }
  const entries: [string, { category: ts.DiagnosticCategory; code: number }][] =
    Object.entries(await body.json())
  const fetchedMessages: typeof diagnosticMessages = new Map()
  for (const [errorMessage, errorMeta] of entries) {
    const match = new RegExp(
      escapeStringRegexp(removeTrailingDot(errorMessage)).replace(
        /'\\{\d\\}'/g,
        '(.+)',
      ),
      'gi',
    )
    fetchedMessages.set(errorMeta.code, {
      match,
      category: errorMeta.category,
      template: errorMessage,
    })
  }
  return fetchedMessages
}

export const createTypeScriptErrorsMarkdownTemplate = (
  errors: {
    category: ts.DiagnosticCategory
    markdown: string
  }[],
  options: TypeScriptErrorDiagnosticMarkdownOptions,
) => errors.map(createTypeScriptErrorMarkdownTemplate(options)).join('\n')

const removeTrailingDot = (message: string) => message.replace(/\.$/, '')

export const createTypeScriptCodeblock = (code: string) => {
  const snippet = removeTrailingDot(code.replace(/^'/, '').replace(/'$/, ''))
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}

export const translateDiagnosticToMarkdown = async (
  code: number,
  errorMessage: string,
) => {
  if (!diagnosticMessages) {
    diagnosticMessages = await fetchDiagnosticMessages()
  }
  const errors = errorMessage.split(TYPESCRIPT_ERROR_BOUNDARY)
  const errorMatch = diagnosticMessages.get(code)
  if (!errorMatch) {
    throw new Error('Unknown TypeScript error')
  }
  return errors.map(errorMessage => ({
    category: errorMatch.category,
    markdown: translateErrorToMarkdown(errorMatch, errorMessage),
  }))
}
