export const createTypeScriptCodeblock = (code: string) => {
  const snippet = code.replace(/'/g, '')
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}
