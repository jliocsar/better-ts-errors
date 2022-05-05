import { createTypeScriptErrorMarkdown } from './markdown'

console.log(
  createTypeScriptErrorMarkdown(
    "Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'Ref | undefined'. Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'RefObject'.",
  ),
)
