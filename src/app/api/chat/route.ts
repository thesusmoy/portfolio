import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

// Create Google AI provider with explicit API key (reads from env if provided)
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

function errorHandler(error: unknown) {
    if (error == null) {
        return 'Unknown error';
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return JSON.stringify(error);
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('[CHAT-API] Incoming messages:', messages);
        // Add system prompt
        messages.unshift(SYSTEM_PROMPT);

        // Add tools
        const tools = {
            getProjects,
            getPresentation,
            getResume,
            getContact,
            getSkills,
            getInternship,
        };

        // Ensure an API key is available (the provider will also default to env var)
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('[CHAT-API] Missing GOOGLE_GENERATIVE_AI_API_KEY');
            return new Response('Missing API key', { status: 500 });
        }

        const result = await streamText({
            model: google('gemini-2.5-flash'),
            messages,
            toolCallStreaming: true,
            tools,
            maxSteps: 2,
        });

        return result.toDataStreamResponse({
            getErrorMessage: errorHandler,
        });
    } catch (err) {
        console.error('Global error:', err);
        const errorMessage = errorHandler(err);
        return new Response(errorMessage, { status: 500 });
    }
}
