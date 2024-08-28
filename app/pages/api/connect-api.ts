// pages/api/connect-openai.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Error from 'next/error';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const organization = process.env.OPENAI_ORGANIZATION_ID;
  const project = process.env.OPENAI_PROJECT_ID;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key not found" });
  }

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      organization: organization,
      project: project,
    });

    res.status(200).json({ message: "Connected to OpenAI", client });
  } catch (error) {
    res.status(500).json({ error });
  }
}