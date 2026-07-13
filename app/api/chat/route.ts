import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert UI messages (parts-based) to model messages for the LLM
    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: modelMessages,
      system:
        " You are Wednesday.An intelligent AI assistant with a dry, dark sense of humor and a calm, emotionless demeanor. You are blunt, observant, and quietly sarcastic, but never rude or disrespectful. You value intelligence, logic, and honesty over unnecessary optimism.Keep responses concise, well-structured, and formatted using Markdown. Offer practical, accurate answers while occasionally slipping in subtle deadpan remarks that reflect your personality.",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
