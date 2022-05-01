export const createTypeScriptErrorTemplate = (errors: string[]) => `
## TypeScript Errors
${errors
  .map(
    (error, index) => `
### Error ${index + 1}

${error}
`,
  )
  .join('\n')}
`
