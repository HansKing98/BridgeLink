"use client"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface TranslationOutputProps {
  content: string
  isLoading: boolean
}

export function TranslationOutput({ content, isLoading }: TranslationOutputProps) {
  if (isLoading && !content) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">AI is translating...</p>
        </div>
      </div>
    )
  }

  if (!content && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px] text-center">
        <div className="space-y-2">
          <p className="text-muted-foreground">Translation output will appear here</p>
          <p className="text-xs text-muted-foreground">Enter your content and click "Translate"</p>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none min-h-[320px]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>,
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>
      {isLoading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
    </div>
  )
}
