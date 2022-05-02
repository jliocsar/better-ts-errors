export const createTypeScriptCodeblock = (code: string) => {
  const snippet = code.replace(/'/g, '')
  console.log({
    code,
    snippet,
  })
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}
