// pages/api/open-thread.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key not found" });
  }

  try {
    const client = new OpenAI({ apiKey: apiKey });
    const thread = await client.beta.threads.create();

    res.status(200).json({ message: "Thread Created", thread });
  } catch (error) {
    res.status(500).json({ error });
  }
}