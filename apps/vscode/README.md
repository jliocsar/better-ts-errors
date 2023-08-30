# Better TS Errors 🧼

A Visual Studio Code extension used for parsing and formatting TypeScript error messages.

Simply enable the `better-ts-errors` extension in your VSCode and hover a TS error to see the magic happening 🌠

## Preview

![Extension preview](/.github/static/preview.png)

You can also preview how the parsing works in the [web application](https://better-ts-errors.vercel.app/).

## Settings

```jsonc
{
  // Prettifies the response with emojis and such.
  "betterTypeScriptErrors.prettify": true
}
```

If you notice the UI stuttering sometimes and/or the autocomplete being delayed, try applying this to your `settings.json` file (this will make so the extension runs in a separate process):

```jsonc
{
  "extensions.experimental.affinity": {
    "better-ts-errors.better-ts-errors": 1
  }
}
```

## Additional Information

- Extension icon by [Freepik](https://www.flaticon.com/authors/freepik)