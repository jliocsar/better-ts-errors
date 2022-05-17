import MarkdownIt from 'markdown-it'

const renderer = new MarkdownIt({
  html: true,
})

export const parseMarkdown = (markdown: string) =>
  renderer.renderInline(markdown)
