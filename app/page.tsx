"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code2, Users, Sparkles, Loader2, Copy, Check, X, Zap } from "lucide-react"
import { TranslationOutput } from "@/components/translation-output"

type TranslationMode = "pm-to-dev" | "dev-to-pm"

// Test cases for PM → Developer
const PM_TEST_CASES = [
  {
    name: "Recommendation Feature",
    input: `We need a smart recommendation feature similar to TikTok's infinite scroll to increase user engagement time. Users should see personalized content based on their interests.`
  },
  {
    name: "Vague PM Requirement",
    input: `We need to improve the user experience and make the app faster. Also add some social features.`
  }
]

// Test cases for Developer → PM
const DEV_TEST_CASES = [
  {
    name: "Performance Optimization",
    input: `Optimized database queries with Redis caching layer. Reduced response time from 800ms to 250ms. QPS increased 30%. Also implemented connection pooling to handle more concurrent requests.`
  },
  {
    name: "Technical Implementation",
    input: `Implemented GraphQL API with Apollo Server. Added JWT authentication middleware. Used TypeScript for type safety. Set up CI/CD pipeline with GitHub Actions.`
  }
]

export default function Home() {
  const [mode, setMode] = useState<TranslationMode>("pm-to-dev")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setOutput("")

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Translation failed" }))
        throw new Error(errorData.error || `HTTP ${response.status}: Translation failed`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader available")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        setOutput((prev) => prev + text)
      }
    } catch (error) {
      console.error("[BridgeLink] Translation error:", error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Translation failed. Please check your API configuration."
      setOutput(`## ❌ Error\n\n${errorMessage}\n\n**Troubleshooting:**\n- Check your API key in environment variables\n- Verify your internet connection\n- Try again in a few moments`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleLoadExample = (testCaseIndex?: number) => {
    const testCases = mode === "pm-to-dev" ? PM_TEST_CASES : DEV_TEST_CASES
    const index = testCaseIndex !== undefined ? testCaseIndex : 0
    if (testCases[index]) {
      setInput(testCases[index].input)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to translate
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        const currentInput = (document.querySelector('textarea') as HTMLTextAreaElement)?.value || ""
        if (currentInput.trim() && !isLoading) {
          handleTranslate()
        }
      }
      // Cmd/Ctrl + K to clear
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !e.shiftKey) {
        e.preventDefault()
        handleClear()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const isPmMode = mode === "pm-to-dev"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BridgeLink</h1>
              <p className="text-xs text-muted-foreground">Communication Translator</p>
            </div>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            v1.0.0
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mode Switcher */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isPmMode ? "default" : "outline"}
              size="lg"
              onClick={() => setMode("pm-to-dev")}
              className="gap-2 min-w-[180px]"
            >
              <Users className="h-4 w-4" />
              PM → Developer
            </Button>
            <div className="h-px w-12 bg-border" />
            <Button
              variant={!isPmMode ? "default" : "outline"}
              size="lg"
              onClick={() => setMode("dev-to-pm")}
              className="gap-2 min-w-[180px]"
            >
              <Code2 className="h-4 w-4" />
              Developer → PM
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isPmMode
              ? "Translate product requirements into technical specifications"
              : "Translate technical implementations into business value"}
          </p>
        </div>

        {/* Translation Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {isPmMode ? (
                  <>
                    <Users className="h-5 w-5 text-primary" />
                    Product Manager Input
                  </>
                ) : (
                  <>
                    <Code2 className="h-5 w-5 text-primary" />
                    Developer Input
                  </>
                )}
              </h2>
            </div>
            {/* Test Cases Section */}
            <div className="mb-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Test Cases:</span>
                {(isPmMode ? PM_TEST_CASES : DEV_TEST_CASES).map((testCase, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadExample(index)}
                    disabled={isLoading}
                    className="gap-1 text-xs h-7"
                  >
                    <Zap className="h-3 w-3" />
                    {testCase.name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                or enter manually
              </p>
            </div>
            <Textarea
              placeholder={
                isPmMode
                  ? 'Enter product requirements or feature descriptions...\n\nExample: "We need a smart recommendation system to increase user engagement time"'
                  : 'Enter technical implementation details...\n\nExample: "Optimized database queries, increased QPS by 30%"'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[320px] font-mono text-sm resize-none"
            />
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {(input || output) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="gap-1 text-xs"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{input.length} chars</span>
                <Button onClick={handleTranslate} disabled={!input.trim() || isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      Translate
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ⌘⏎
                </span>
              </div>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {isPmMode ? (
                  <>
                    <Code2 className="h-5 w-5 text-primary" />
                    Technical Specification
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 text-primary" />
                    Business Value
                  </>
                )}
              </h2>
              {output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <TranslationOutput content={output} isLoading={isLoading} />
          </Card>
        </div>

        {/* Examples Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Example: PM → Developer
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Input:</p>
                <p className="font-mono text-xs bg-background p-3 rounded-md border">
                  We need a smart recommendation feature to boost user engagement
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Output includes:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Algorithm recommendations (collaborative filtering, etc.)</li>
                  <li>Data source and processing strategy</li>
                  <li>Performance requirements</li>
                  <li>Development effort estimation</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Example: Developer → PM
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Input:</p>
                <p className="font-mono text-xs bg-background p-3 rounded-md border">
                  Optimized DB queries with Redis caching, QPS increased 30%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Output includes:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>User experience improvements</li>
                  <li>Business growth capacity</li>
                  <li>Cost reduction benefits</li>
                  <li>Risk assessment</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
