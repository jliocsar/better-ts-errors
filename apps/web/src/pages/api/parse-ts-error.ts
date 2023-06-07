// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import type { ResponseData } from '~/types/response'
import { typeScriptErrorDiagnosticToMarkdown } from '@better-ts-errors/parser'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const response = typeScriptErrorDiagnosticToMarkdown(req.body)
  return res.status(200).json(response)
}
