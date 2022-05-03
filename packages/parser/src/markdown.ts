import { Marked, Renderer } from '@ts-stack/markdown'
import hljs from 'highlight.js'

import { createTypeScriptErrorTemplate } from './utils/create-typescript-error-template'
import { parseErrorMessage } from './utils/parse-error-message'
import { theme } from './styles/theme'

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: (code, language) => {
    if (!language) {
      throw new Error(`No language specified for code block: ${code}`)
    }

    const { value: highlightedCode } = hljs.highlight(code, {
      language,
    })

    return highlightedCode
  },
})

export const createTypeScriptErrorMarkdown = (errorMessage: string) => {
  const parsedErrors = parseErrorMessage(errorMessage)
  const errorCount = parsedErrors.length
  const typeScriptErrorsTemplate = createTypeScriptErrorTemplate(parsedErrors)
  const highlightCssTheme = `<style>${theme}</style>`
  const template = [
    highlightCssTheme,
    Marked.parse(typeScriptErrorsTemplate),
  ].join('\n')

  return {
    template,
    errorCount,
    wasInvalidErrorMessage: !errorCount,
  }
}
