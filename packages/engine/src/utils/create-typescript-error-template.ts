export const createTypeScriptErrorTemplate = (errors: string[]) => `
${errors
  .map(
    (error, index) => `
### Error ${index + 1}

${error}
`,
  )
  .join('\n')}
`
