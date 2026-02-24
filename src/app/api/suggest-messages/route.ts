import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

type CoreMessage = { role: 'user' | 'assistant'; content: string };

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Properly type the incoming messages as CoreMessage[]
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = streamText({
      model: google('gemini-1.5-flash'), // Fast and reliable for suggestions
      system: `You are a helpful assistant. Provide creative suggestions when asked.
               If the user asks for weather, use the weather tool.`,
      messages,
      tools: {
        weather: tool({
          description: 'Get the current weather in a given location',
          // inputSchema is required for proper type inference in 'execute'
          inputSchema: z.object({
            location: z.string().describe('The city and state, e.g. San Francisco, CA'),
          }),
          execute: async ({ location }) => {
            // Mock weather data logic
            const temperature = Math.round(Math.random() * (90 - 32) + 32);
            return {
              location,
              temperature,
              unit: 'fahrenheit',
            };
          },
        }),
      },
    });

    // 2. Return the stream in the standard format for useChat/useCompletion
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process AI request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}