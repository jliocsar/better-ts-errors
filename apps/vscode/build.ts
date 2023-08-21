import * as path from 'path'
import * as fs from 'fs/promises'
import { stdout, stderr, exit } from 'process'

import * as esbuild from 'esbuild'

const ROOT = path.resolve(__dirname, '../..')

//
;(async () => {
  const log = (message: string) => stdout.write('[🍕] ' + message)

  try {
    log('Building extension...')
    log(' Reading diagnostic messages...')
    const buffer = await fs.readFile(
      path.resolve(ROOT, 'diagnostic-messages.json'),
    )
    const dMapString = buffer.toString()
    log(' Calling `esbuild`...')
    await esbuild.build({
      entryPoints: ['src/extension.ts'],
      bundle: true,
      platform: 'node',
      target: 'node14',
      outfile: 'out/extension.js',
      external: ['vscode'],
      format: 'cjs',
      minify: true,
      define: {
        __INJECTED_DMAP__: dMapString,
      },
    })
    log('✅ Build done!')
  } catch (error) {
    stderr.write((error as Error).message)
    exit(1)
  }
})()
