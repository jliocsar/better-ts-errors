import * as fs from 'fs/promises'
import * as path from 'path'
import { exit } from 'process'

import { request } from 'undici'
import { TDiagnosticMessages } from '@better-ts-errors/formatter/src'

import { log } from './utils'

export const ROOT = path.resolve(__dirname, '..')

const diagnosticMessagesToMap = (diagnosticMessages: TDiagnosticMessages) => {
  const map: { [code: number]: string } = {}
  const entries = Object.entries(diagnosticMessages)
  for (const [errorMessage, { code }] of entries) {
    map[code] = errorMessage
  }
  return map
}

const fetchDiagnosticMessages = async () => {
  const { statusCode, body } = await request(
    `https://raw.githubusercontent.com/microsoft/TypeScript/main/src/compiler/diagnosticMessages.json`,
  )
  if (statusCode !== 200) {
    console.error('Failed to fetch diagnostic messages')
    exit(1)
  }
  const diagnosticMessages = (await body.json()) as TDiagnosticMessages
  return diagnosticMessagesToMap(diagnosticMessages)
}

;(async () => {
  try {
    log('Fetching diagnostic messages...')
    // DMap stands for `DiagnosticMessagesMap`
    const DMap = await fetchDiagnosticMessages()
    log('Writing diagnostic messages to JSON file...')
    await fs.writeFile(
      path.resolve(ROOT, 'diagnostic-messages.json'),
      JSON.stringify(DMap),
    )
    log('✅ Done!')
    exit()
  } catch (error) {
    console.error(error)
    exit(1)
  }
})()
