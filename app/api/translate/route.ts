import { streamText } from "ai"
import { getPmToDevPrompt, getDevToPmPrompt } from "@/lib/prompt-templates"
import { TranslationRequestSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request using Zod schema
    const validationResult = TranslationRequestSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(", ")
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const { input, mode } = validationResult.data

    const apiKey = process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY
    const baseURL = process.env.CUSTOM_API_BASE_URL

    if (!apiKey) {
      return new Response(
        "API key not configured. Please add OPENAI_API_KEY or CUSTOM_API_KEY to environment variables.",
        { status: 500 },
      )
    }

    const systemPrompt = mode === "pm-to-dev" ? getPmToDevPrompt() : getDevToPmPrompt()

    if (baseURL && process.env.CUSTOM_API_KEY) {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[BridgeLink] Custom API error:", errorText)
        
        // Provide user-friendly error messages
        let errorMessage = "Translation service unavailable"
        if (response.status === 401) {
          errorMessage = "API key is invalid. Please check your configuration."
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later."
        } else if (response.status >= 500) {
          errorMessage = "Translation service is temporarily unavailable. Please try again."
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: response.status, headers: { "Content-Type": "application/json" } }
        )
      }

      // Parse SSE stream and convert to simple text stream
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }

          let buffer = ""

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split("\n")
              buffer = lines.pop() || ""

              for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || trimmed === "data: [DONE]") continue

                if (trimmed.startsWith("data: ")) {
                  try {
                    const jsonStr = trimmed.slice(6)
                    const data = JSON.parse(jsonStr)

                    // Handle different response formats
                    let content = ""

                    // Standard OpenAI format
                    if (data.choices?.[0]?.delta?.content) {
                      content = data.choices[0].delta.content
                    }
                    // Custom proxy format (like AI Gateway)
                    else if (data.type === "response.output_text.delta" && data.delta) {
                      content = data.delta
                    }

                    if (content) {
                      controller.enqueue(encoder.encode(content))
                    }
                  } catch (e) {
                    console.error("[v0] Failed to parse SSE chunk:", e)
                  }
                }
              }
            }

            controller.close()
          } catch (error) {
            console.error("[v0] Stream reading error:", error)
            controller.error(error)
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Use AI SDK for standard OpenAI API
    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[BridgeLink] Translation API error:", error)
    
    // Provide user-friendly error messages
    let errorMessage = "An unexpected error occurred during translation"
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection."
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again."
      } else {
        errorMessage = error.message
      }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
