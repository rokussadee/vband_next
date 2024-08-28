// pages/api/init-assistant.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const assistantID = process.env.OPENAI_ASSISTANT_ID;

  if (!apiKey || !assistantID) {
    return res.status(500).json({ error: "API Key or Assistant ID not found" });
  }

  try {
    const client = new OpenAI({ apiKey: apiKey });
    const assistant = await client.beta.assistants.retrieve(assistantID);

    res.status(200).json({ message: "Assistant Initialized", assistant });
  } catch (error) {
    res.status(500).json({ error });
  }
}