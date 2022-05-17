import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

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
