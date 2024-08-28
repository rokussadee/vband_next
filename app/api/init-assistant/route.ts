
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
    const assistantID = process.env.OPENAI_ASSISTANT_ID;

    if (!assistantID) {
      throw new Error('The OPENAI_ASSISTANT_ID environment variable is missing or empty.');
    }

    const assistant = await openai.beta.assistants.retrieve(assistantID);
    return NextResponse.json({ success: true, assistant });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}