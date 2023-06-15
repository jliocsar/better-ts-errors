// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import type { ResponseData } from '~/types/response'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  return res.status(400).json({
    template: 'Sorry, this is not working',
    errorCount: 0,
    wasInvalidErrorMessage: false,
  })
}
