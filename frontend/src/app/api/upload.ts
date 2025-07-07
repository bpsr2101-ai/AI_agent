import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error' });
    }
    const file = files.file;
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileStream = fs.createReadStream(file.filepath);
    const backendRes = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/upload', {
      method: 'POST',
      headers: {},
      body: fileStream,
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  });
} 