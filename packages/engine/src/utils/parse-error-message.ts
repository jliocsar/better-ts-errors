import { createTypeScriptCodeblock } from './create-typescript-code-block'

const TYPESCRIPT_ERROR_CODE_SNIPPET_REGEX = /'([^']*)'/g

export const parseErrorMessage = (message: string) => {
  const errors = message.split(/\.\s*/).slice(0, -1)
  const parsedErrors = errors.map(error =>
    error.replace(
      TYPESCRIPT_ERROR_CODE_SNIPPET_REGEX,
      createTypeScriptCodeblock,
    ),
  )

  return parsedErrors
}
