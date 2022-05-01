export const createTypeScriptErrorTemplate = (errors: string[]) => `
## TypeScript Errors (${errors.length})
${errors
  .map(
    (error, index) => `
### Error ${index + 1}

${error}
`,
  )
  .join('\n')}
`
