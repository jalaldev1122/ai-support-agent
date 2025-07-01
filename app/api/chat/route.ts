import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      model: openai("gpt-4o"),
      messages,
      system: `You are a helpful AI support assistant. Your primary job is to help users create support tickets by collecting information through conversation.

          ALWAYS respond to every user message. Never leave a message unanswered.

          If this is the user's first message or they're describing an issue, start by acknowledging their problem and then begin collecting the following information step by step:

          1. Issue description (what exactly is the problem?)
          2. User's full name
          3. Email address
          4. Issue category (Technical Issue, Account Problem, Billing Question, Feature Request, Bug Report, General Inquiry)
          5. Priority level (low, medium, high)
          6. Brief title for the ticket

          CONVERSATION FLOW:
          - First, acknowledge their issue and ask for more details if needed
          - Then ask: "To create your support ticket, I'll need some information. What's your full name?"
          - Then ask: "What's your email address?"
          - Then suggest a category: "Based on your issue, this sounds like a [category]. Does that seem right?"
          - Then suggest priority: "This seems like [priority] priority. Does that sound appropriate?"
          - Finally ask: "What would you like the title of your ticket to be?"

          When you have all information, respond with:
          "Perfect! I've created your support ticket:

          TICKET_CREATED:{"userName":"[name]","email":"[email]","category":"[category]","priority":"[priority]","title":"[title]","description":"[full description]"}

          Your ticket has been created successfully!"

          IMPORTANT: Always provide a helpful response to every user message.`,
    });

    return Response.json({
      role: "assistant",
      content: result.text,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
