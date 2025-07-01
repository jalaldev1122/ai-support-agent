import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST() {
  try {
    // Test the OpenAI connection with a simple request
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: "Say 'Hello, I am working!' in exactly those words.",
      maxTokens: 20,
    })

    return Response.json({
      success: true,
      message: "Connection successful",
      response: result.text,
    })
  } catch (error) {
    console.error("Test API error:", error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to connect to OpenAI API",
      },
      { status: 500 },
    )
  }
}
