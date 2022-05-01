const TYPESCRIPT_ERROR_CODE_SNIPPET_REGEX = /'([^']*)'/g

export const createTypeScriptCodeblock = (code: string) => {
  const snippet = code.replace(/'/g, '')
  return ['\n```ts\n', snippet, '\n```\n'].join('')
}

export const parseErrorMessage = (message: string) => {
  const errors = message.replace(/\.$/, '').split('. ')
  const parsedErrors = errors.map(error =>
    error.replace(
      TYPESCRIPT_ERROR_CODE_SNIPPET_REGEX,
      createTypeScriptCodeblock,
    ),
  )

  return parsedErrors
}
