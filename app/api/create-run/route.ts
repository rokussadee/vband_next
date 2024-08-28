import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getOpenAIClient } from '@/app/lib/openaiClient';
//    const apiKey = process.env.OPENAI_API_KEY;
//    const organization = process.env.OPENAI_ORGANIZATION_ID;
//    const project = process.env.OPENAI_PROJECT_ID;
    const assistantID = process.env.OPENAI_ASSISTANT_ID 
//    console.log(apiKey);
//    const openai = new OpenAI({
//      apiKey: apiKey,
//      organization: organization,
//      project: project
//    })
 
export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { threadID } = await req.json(); // Assuming threadID is sent in the request body

    if (!threadID) {
      throw new Error('The threadID is required.');
    }
    if (!assistantID) {
      throw new Error(`The assistantID is required`);
    }

    // Start a "run" on the assistant API using the threadID
    const run = await openai.beta.threads.runs.create(threadID, {
      assistant_id: assistantID!,
      instructions: "Please respond to the user in a JSON format, containing the properties shown in the system instructions."
    });

    return NextResponse.json({ success: true, run });
  } catch (error) {
    console.error('Error starting run:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}