import type { NextApiRequest, NextApiResponse } from 'next';

// Fake users data

export default function handler(_req: NextApiRequest, res: NextApiResponse<{ status: string }>) {
  // Get data from your database
  const x = process.env.SMTP_USERNAME || '';
  res.status(200).json({ status: x });
}
