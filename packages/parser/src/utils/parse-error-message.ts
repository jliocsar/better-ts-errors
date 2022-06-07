import { createTypeScriptCodeblock } from './create-typescript-code-block'

const TYPESCRIPT_SNIPPET_REGEX = /'([^']*)'/g

// TODO: Create a better utils structure

const reduceErrorMessageToMarkdown = (
  result: string[],
  messagePart: string,
  // currentIndex: number,
  // array: string[],
) => {
  switch (true) {
    default:
      return [...result, messagePart]
  }
}

export const parseErrorMessage = (message: string) => {
  const errors = message.split(/(?<!\.)\.(?!\.)/g)
  const parsedErrors = errors.map(error => {
    const codeBlockedError = error.replace(
      TYPESCRIPT_SNIPPET_REGEX,
      createTypeScriptCodeblock,
    )
    const errorMessageSplit = codeBlockedError.split(' ')
    const markdownFormattedMessageSplit = errorMessageSplit.reduce(
      reduceErrorMessageToMarkdown,
      [] as string[],
    )

    return markdownFormattedMessageSplit.join(' ')
  })

  return parsedErrors
}
