import * as fs from 'fs/promises'
import * as path from 'path'

import * as vscode from 'vscode'
import { URI } from 'vscode-uri'

import { type TDiagnosticSeverity, CategoryIconMap, ROOT } from './constants'

export type TFormatOptions = {
  prettify?: boolean
}
export type TDMap = {
  [errorCode: number]: string
}
export type TDiagnosticMessages = {
  [errorMessage: string]: {
    category: string
    code: number
  }
}
export type TTypeScriptDiagnosticMessageFormatter = (
  code: number,
  message: string,
  relatedInformation?: TVSCodeDiagnostic['relatedInformation'],
) =>
  | [
      formattedMessage: string,
      formattedWhys: string[],
      formattedDiagnosticMessages: string[] | null,
    ]
  | null
type TVSCodeDiagnostic = {
  code?: number | string
  message: string
  relatedInformation?: vscode.DiagnosticRelatedInformation[]
  severity: TDiagnosticSeverity[keyof TDiagnosticSeverity]
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

const whysToMarkdown = (whys: string[]) => {
  const formatted = []
  let index = 0
  const length = whys.length
  while (index < length) {
    const why = whys[index++]
    formatted.push(
      why.replace(
        /(\s+)(.*)/,
        (_match, spaces, text) =>
          `${spaces}* \`${
            index ? `Because ${text[0].toLowerCase() + text.slice(1)}` : text
          }\``,
      ),
    )
  }
  return formatted
}

export const loadDiagnosticMessages = async () => {
  const buffer = await fs.readFile(
    path.resolve(ROOT, 'diagnostic-messages.json'),
  )
  return JSON.parse(buffer.toString())
}

export const createTypeScriptDiagnosticMessageFormatter =
  (DMap: TDMap): TTypeScriptDiagnosticMessageFormatter =>
  (code, message, relatedInformation) => {
    const [reason, ...whys] = message.split(/\n/)
    let formattedReason = reason
    const matchedDiagnosticMessage = code ? DMap?.[code] : null
    if (matchedDiagnosticMessage) {
      const snippetsMatch = new RegExp(
        matchedDiagnosticMessage.replace(/('\{\d+\}')/g, '(.+)'),
      )
      const matchedSnippetsResult = message.match(snippetsMatch)
      if (!matchedSnippetsResult) {
        return null
      }
      const [, ...snippets] = matchedSnippetsResult
      while (snippets.length) {
        const snippet = snippets.shift()!
        formattedReason = formattedReason.replace(
          snippet,
          snippetToMarkdownBlock,
        )
      }
      formattedReason = removeTrailingDots(formattedReason)
    }
    const formattedRelatedInformation =
      relatedInformation?.map(relatedInformationToMarkdownLink) ?? null
    return [formattedReason, whysToMarkdown(whys), formattedRelatedInformation]
  }

export const createTypeScriptErrorMarkdownTemplateFactory =
  (formatTypeScriptDiagnosticMessage: TTypeScriptDiagnosticMessageFormatter) =>
  (
    { message, severity, code, relatedInformation }: TVSCodeDiagnostic,
    { prettify = false }: TFormatOptions,
  ) => {
    let title = `**Error**`
    if (prettify) {
      const icon = CategoryIconMap[severity] ?? CategoryIconMap.Message
      title = `**\`${icon} Error\`**`
    }

    const formatted = formatTypeScriptDiagnosticMessage(
      Number(code),
      message,
      relatedInformation,
    )
    if (!formatted) {
      return null
    }
    const [formattedMessage, formattedWhys, formattedRelatedInformation] =
      formatted

    return `
${title}
[(ts ${code})](https://typescript.tv/errors/#TS${code})

${formattedMessage}

${formattedWhys.length ? '\n**Why:**\n' + formattedWhys.join('\n') : ''}

${
  formattedRelatedInformation
    ? '\n**Related Information:**\n' + formattedRelatedInformation.join('\n')
    : ''
}
`.trim()
  }
