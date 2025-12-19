import { streamText } from "ai"
import { getPmToDevPrompt, getDevToPmPrompt } from "@/lib/prompt-templates"

export async function POST(req: Request) {
  try {
    const { input, mode } = await req.json()

    if (!input?.trim()) {
      return new Response("Input is required", { status: 400 })
    }

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
        console.error("[v0] Custom API error:", errorText)
        throw new Error(`API request failed: ${response.statusText}`)
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
    console.error("[v0] Translation API error:", error)
    return new Response(error instanceof Error ? error.message : "Translation failed", { status: 500 })
  }
}
