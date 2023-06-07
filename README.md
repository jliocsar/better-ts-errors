# Better TS Errors 🧼

A parser and formatter for visualizing a simplified version of TS errors.

## Description

This tool outputs a markdown formatted version of a TypeScript error, including syntax highlight for code snippets etc.
The main idea is to use this tool as a VSCode extension, but it will be used as a web. application for now.
It's still under development and will most likely change in the future.

This project was highly inspired by [ts-error-translator](https://github.com/mattpocock/ts-error-translator) from [Matt Pocock](https://twitter.com/mpocock1).

## Settings

```json
{
  // Disables the error messages if set to `false`.
  "betterTypeScriptErrors.showParsedMessages": true,
  // Prettifies the response with emojis and such.
  "betterTypeScriptErrors.prettify": true
}
```
