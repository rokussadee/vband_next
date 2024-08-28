import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getOpenAIClient } from '@/app/lib/openaiClient';

//    const openai = new OpenAI({
//      apiKey: process.env.OPENAI_API_KEY!,
//      organization: process.env.OPENAI_ORGANIZATION_ID!,
//      project: process.env.OPENAI_PROJECT_ID!,
//    });
export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient();

    const thread = await openai.beta.threads.create();
    return NextResponse.json({ success: true, thread });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}