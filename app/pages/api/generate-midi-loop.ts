// pages/api/generate-midi-loop.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { baseLoopPrompt } from '../../global/prompts';
import { MidiRequestPayload } from '../../lib/dto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { client, threadID, midiRequestPayload }: { client: OpenAI, threadID: string, midiRequestPayload: MidiRequestPayload } = req.body;

  if (!client || !threadID) {
    return res.status(400).json({ error: "Client or Thread ID missing" });
  }

  try {
    const prompt = baseLoopPrompt(midiRequestPayload);
    const message = await client.beta.threads.messages.create(threadID, {
      role: 'user',
      content: prompt,
    });

    const response = message.content[0];
    if (response.type === 'text') {
      res.status(200).json({ message: response.text.value });
    } else {
      res.status(500).json({ error: "Unexpected response format from OpenAI" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}