import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { baseLoopPrompt } from '@/app/global/prompts';
import { getOpenAIClient } from '@/app/lib/openaiClient';
//    const apiKey = process.env.OPENAI_API_KEY;
//    const organization = process.env.OPENAI_ORGANIZATION_ID;
//    const project = process.env.OPENAI_PROJECT_ID;
//    console.log(apiKey);
//    const openai = new OpenAI({
//      apiKey: apiKey,
//      organization: organization,
//      project: project
//    })
 

export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { threadID, midiRequest } = await req.json();
    const prompt = baseLoopPrompt(midiRequest);

    const message = await openai.beta.threads.messages.create(threadID, {
      role: 'user',
      content: prompt,
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const assistantMessage = response.text.value;
      return NextResponse.json({ success: true, assistantMessage });
    }

    return NextResponse.json({ success: false, error: 'No valid response from assistant.' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}