import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getOpenAIClient } from '../../lib/openaiClient';

//    const apiKey = process.env.OPENAI_API_KEY;
//    const organization = process.env.OPENAI_ORGANIZATION_ID;
//    const project = process.env.OPENAI_PROJECT_ID;
//    const assistantID = process.env.OPENAI_ASSISTANT_ID 
//    console.log(apiKey);
//    const openai = new OpenAI({
//      apiKey: apiKey,
//      organization: organization,
//      project: project
//    })
 
export async function POST(req: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { threadID, runID } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('The OPENAI_API_KEY environment variable is missing or empty.');
    }

    const pollRunStatus = async (): Promise<string> => {
      const run = await openai.beta.threads.runs.retrieve(threadID, runID);
      if (run.status !== 'completed') {
        console.log(`Run status: ${run.status}. Polling again in 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        return await pollRunStatus(); // Recursively poll the status
      }
      return run.status;
    };

    const finalStatus = await pollRunStatus();
    return NextResponse.json({ success: true, status: finalStatus });

  } catch (error) {
    console.error('Error polling run status:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}