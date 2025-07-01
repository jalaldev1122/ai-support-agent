"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hi! I'm your AI support assistant. What issue are you experiencing today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const data = JSON.parse(line.slice(2))
              if (data.type === "text-delta") {
                assistantMessage += data.textDelta
                setMessages([...newMessages, { role: "assistant", content: assistantMessage }])
              }
            } catch (e) {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Chat (Debug Version)</h1>

        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>AI Support Assistant - Debug</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded ${message.role === "user" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"}`}
              >
                <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 mr-8 p-3 rounded mb-4">
                <strong>Assistant:</strong>
                <p className="mt-1">Typing...</p>
              </div>
            )}
          </CardContent>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
