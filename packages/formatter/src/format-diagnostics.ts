import * as vscode from 'vscode'
import { URI } from 'vscode-uri'

import { type TDiagnosticSeverity, CategoryIconMap } from './constants'

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

const snippetToMarkdownBlock = (snippet: string) => {
  const unquoted = snippet.replace(/(^')/g, '').replace(/'$/, '')
  return `
\`\`\`ts
${unquoted}
\`\`\`
`
}

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
  )}\` [(${rangeStart}, ${rangeEnd}) 🔗](${link})`
}

const whysToMarkdown = (whys: string[]) => {
  const formatted = []
  const length = whys.length
  for (let index = 0; index < length; index++) {
    const why = whys[index]
    try {
      const formattedWhy = why.replace(
        /(\s+)(.*)/,
        (_match, spaces, text) =>
          `${spaces}* \`${
            index ? `Because ${text[0].toLowerCase() + text.slice(1)}` : text
          }\``,
      )
      formatted.push(formattedWhy)
    } catch (error) {
      console.error((error as Error).message)
      continue
    }
  }
  return formatted
}

export const loadDiagnosticMessages = () =>
  /** this is injected by esbuild using `define` */
  // @ts-ignore
  __INJECTED_DMAP__

export const createTypeScriptDiagnosticMessageFormatter =
  (DMap: TDMap): TTypeScriptDiagnosticMessageFormatter =>
  (code, message, relatedInformation) => {
    const [reason, ...whys] = message.split(/\n/)
    let formattedReason = reason
    const matchedDiagnosticMessage = code ? DMap?.[code] : null
    if (matchedDiagnosticMessage) {
      const snippetsMatch = new RegExp(
        matchedDiagnosticMessage.replace(
          // replaces the already escaped `{\d+}` with a regex that matches any string
          // so we can replace the snippet parts with markdown code blocks
          /('\{\d+\}')/g,
          '(.+)',
        ),
      )
      const matchedSnippetsResult = message.match(snippetsMatch)
      if (!matchedSnippetsResult) {
        return null
      }
      const [, ...snippets] = matchedSnippetsResult
      for (const snippet of snippets) {
        try {
          formattedReason = formattedReason.replace(
            snippet,
            snippetToMarkdownBlock,
          )
        } catch (error) {
          console.error((error as Error).message)
          continue
        }
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
    errorIndex: number,
    { message, severity, code, relatedInformation }: TVSCodeDiagnostic,
    { prettify = false }: TFormatOptions,
  ) => {
    const errorNum = errorIndex + 1
    let title = `**Error** #${errorNum}`
    if (prettify) {
      const icon = CategoryIconMap[severity] ?? CategoryIconMap.Message
      title = `**\`${icon} Error #${errorNum}\`**`
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
