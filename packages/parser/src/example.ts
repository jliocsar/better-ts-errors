import { typeScriptErrorDiagnosticToMarkdown } from './markdown'

console.log(
  typeScriptErrorDiagnosticToMarkdown(
    "Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'Ref | undefined'. Type 'MutableRefObject<ForwardRefExoticComponent<TextInputProps & RefAttributes> | null>' is not assignable to type 'RefObject'.",
  ),
)
