import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question, session_id } = req.body;
  try {
    const backendRes = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      credentials: 'include',
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Backend error' });
  }
} 