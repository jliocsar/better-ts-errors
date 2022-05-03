import { createTypeScriptErrorMarkdown } from './markdown'
;(async () => {
  const markdown = await createTypeScriptErrorMarkdown(
    "Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'Ref | undefined'. Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'RefObject'.",
  )

  console.log(markdown)
})()
