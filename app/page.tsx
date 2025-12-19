"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code2, Users, Sparkles, Loader2 } from "lucide-react"
import { TranslationOutput } from "@/components/translation-output"

type TranslationMode = "pm-to-dev" | "dev-to-pm"

export default function Home() {
  const [mode, setMode] = useState<TranslationMode>("pm-to-dev")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

      if (!response.ok) throw new Error("Translation failed")

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
      console.error("[v0] Translation error:", error)
      setOutput("❌ Translation failed. Please check your API configuration.")
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{input.length} characters</span>
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
