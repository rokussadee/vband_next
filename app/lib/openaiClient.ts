// lib/openaiClient.ts

import { OpenAI } from 'openai';

let openaiClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        const organization = process.env.OPENAI_ORGANIZATION_ID;
        const project = process.env.OPENAI_PROJECT_ID;

        if (!apiKey) {
            throw new Error('The OPENAI_API_KEY environment variable is missing or empty.');
        }

        openaiClient = new OpenAI({
            apiKey,
            organization,
            project,
        });

        console.log('OpenAI client initialized');
    }
    return openaiClient;
};