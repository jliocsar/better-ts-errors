// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { createTypeScriptErrorMarkdown } from '@better-ts-errors/engine'

type Data = {
  content: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const content = await createTypeScriptErrorMarkdown(req.body)
  return res.status(200).json({ content })
}
