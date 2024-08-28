import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getOpenAIClient } from '@/app/lib/openaiClient';

    const apiKey = process.env.OPENAI_API_KEY;
//    const organization = process.env.OPENAI_ORGANIZATION_ID;
//    const project = process.env.OPENAI_PROJECT_ID;
//    console.log(apiKey);
//    const openai = new OpenAI({
//      apiKey: apiKey,
//    })
 
export async function POST() {
  try {
    const openai = getOpenAIClient();

    if (!apiKey) {
      throw new Error('The OPENAI_API_KEY environment variable is missing or empty.');
    }

    console.log(openai);
   
    return NextResponse.json({ success: true, openai: openai});
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}