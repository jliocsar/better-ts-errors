import { createTypeScriptCodeblock } from './create-typescript-code-block'

const TYPESCRIPT_SNIPPET_REGEX = /'([^']*)'/g

const splitErrorMessage = (message: string) => {
  const errorOrEmptyStringList = message.replace(/\.$/, '').split(/\.\s+/)
  return errorOrEmptyStringList.filter(Boolean)
}

export const parseErrorMessage = (message: string) => {
  const errors = splitErrorMessage(message)
  const parsedErrors = errors.map(error =>
    error.replace(TYPESCRIPT_SNIPPET_REGEX, createTypeScriptCodeblock),
  )

  return parsedErrors
}
