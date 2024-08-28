import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
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
    const { threadID } = await req.json();

    const messages = await openai.beta.threads.messages.list(threadID);
    return NextResponse.json({ success: true, messages: messages.data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}