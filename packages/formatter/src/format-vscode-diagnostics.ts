import ts from 'typescript'
import * as vscode from 'vscode'
import { URI } from 'vscode-uri'
import { request } from 'undici'

import { CategoryIconMap, MINUTE, TDiagnosticSeverity } from './constants'

export type TFormatOptions = {
  prettify?: boolean
}
type TDiagnosticMessages = {
  [errorMessage: string]: {
    category: string
    code: number
  }
}
type TVSCodeDiagnostic = {
  code?: number | string
  message: string
  relatedInformation?: vscode.DiagnosticRelatedInformation[]
  severity: TDiagnosticSeverity[keyof TDiagnosticSeverity]
}

let disableFetch = false
let diagnosticMessages: Map<number, string>

const diagnosticMessagesToMap = (diagnosticMessages: TDiagnosticMessages) => {
  const map = new Map()
  const entries = Object.entries(diagnosticMessages)
  for (const [errorMessage, { code }] of entries) {
    map.set(code, errorMessage)
  }
  return map
}

export const fetchDiagnosticMessages = async () => {
  if (diagnosticMessages || disableFetch) {
    return
  }
  const { statusCode, body } = await request(
    `https://raw.githubusercontent.com/microsoft/TypeScript/v${ts.version.toString()}/src/compiler/diagnosticMessages.json`,
  )
  if (statusCode !== 200) {
    console.error('Failed to fetch diagnostic messages')
    disableFetch = true
    // Throttle the requests in case of an error
    return setTimeout(() => {
      disableFetch = false
    }, MINUTE * 5)
  }
  const json = (await body.json()) as TDiagnosticMessages
  return (diagnosticMessages = diagnosticMessagesToMap(json))
}

const removeTrailingDots = (value: string) => value.replace(/[\.,]\s?$/, '')

const snippetToMarkdownBlock = (snippet: string) =>
  `
\`\`\`ts
${snippet.replace(/^'|'$/g, '')}
\`\`\`
`

const relatedInformationToMarkdownLink = ({
  message,
  location,
}: vscode.DiagnosticRelatedInformation) => {
  const locationPath = URI.parse(location.uri.toString()).path
  const rangeStart = location.range.start.line + 1
  const rangeEnd = location.range.end.character + 1
  const link = `${locationPath}#${rangeStart},${rangeEnd}`
  return `* \`${removeTrailingDots(
    message,
  )}\`: [(${rangeStart}, ${rangeEnd}) 🔗](${link})`
}

const matchAndFormatDiagnosticMessage = (
  code: number,
  message: string,
  relatedInformation?: TVSCodeDiagnostic['relatedInformation'],
):
  | [formattedMessage: string, formattedDiagnosticMessages: string[] | null]
  | null => {
  const matchedDiagnosticMessage = code ? diagnosticMessages?.get(code) : null
  if (!matchedDiagnosticMessage) {
    return null
  }
  const snippetsMatch = new RegExp(
    matchedDiagnosticMessage.replace(/('\{\d+\}')/g, '(.+)'),
  )
  const matchedSnippetsResult = message.match(snippetsMatch)
  if (!matchedSnippetsResult) {
    return null
  }
  const [, ...snippets] = matchedSnippetsResult
  let formatted = message
  const parsedRelatedInformation =
    relatedInformation?.map(relatedInformationToMarkdownLink) ?? null
  while (snippets.length) {
    const snippet = snippets.shift()!
    formatted = formatted.replace(snippet, snippetToMarkdownBlock)
  }
  formatted = removeTrailingDots(formatted)
  return [formatted, parsedRelatedInformation]
}

export const createTypeScriptErrorMarkdownTemplate = (
  { message, severity, code, relatedInformation }: TVSCodeDiagnostic,
  { prettify = false }: TFormatOptions,
) => {
  let title = `**Error**`

  if (prettify) {
    const icon = CategoryIconMap[severity] ?? CategoryIconMap.Message
    title = `**\`${icon} Error\`**`
  }

  const formatted = matchAndFormatDiagnosticMessage(
    Number(code),
    message,
    relatedInformation,
  )
  if (!formatted) {
    return null
  }
  const [parsedMessage, parsedRelatedInformation] = formatted

  return `
${title}
[(ts ${code})](https://typescript.tv/errors/#TS${code})

${parsedMessage}

${
  parsedRelatedInformation
    ? '\n**Related Information:**\n' + parsedRelatedInformation.join('\n')
    : ''
}
`.trim()
}
