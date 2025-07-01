"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Settings } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    setErrorMessage("")

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true }),
      })

      if (response.ok) {
        setTestResult("success")
      } else {
        const errorData = await response.json()
        setTestResult("error")
        setErrorMessage(errorData.error || "Unknown error occurred")
      }
    } catch (error) {
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Network error")
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup & Troubleshooting</h1>
          <p className="text-gray-600">Configure and test your AI Support Agent</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key Status</label>
              <Alert>
                <AlertDescription>
                  {process.env.OPENAI_API_KEY ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      API key is configured
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="w-4 h-4" />
                      API key is missing. Add OPENAI_API_KEY to your environment variables.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <Button onClick={testConnection} disabled={testing} className="w-full">
                {testing ? "Testing Connection..." : "Test AI Connection"}
              </Button>
            </div>

            {testResult === "success" && (
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription className="text-green-700">
                  ✅ Connection successful! The AI assistant is ready to use.
                </AlertDescription>
              </Alert>
            )}

            {testResult === "error" && (
              <Alert>
                <XCircle className="w-4 h-4" />
                <AlertDescription className="text-red-700">❌ Connection failed: {errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. "An error occurred" in chat</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Check that OPENAI_API_KEY is set in your .env.local file</li>
                <li>Verify your OpenAI API key is valid and has credits</li>
                <li>Ensure you have access to GPT-4 models</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Chat not responding</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Check browser console for JavaScript errors</li>
                <li>Verify the API route is accessible at /api/chat</li>
                <li>Try refreshing the page</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. Environment Setup</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                # .env.local
                <br />
                OPENAI_API_KEY=sk-your-key-here
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/chat">
            <Button size="lg">Try Chat Interface</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
