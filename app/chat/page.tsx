"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, ArrowLeft, Send, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { useTicketStore } from "@/lib/stores/ticket-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hi! I'm your AI support assistant. I'm here to help you create a support ticket. What issue are you experiencing today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ticketCreated, setTicketCreated] = useState(false)
  const addTicket = useTicketStore((state) => state.addTicket)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-focus input after AI responds
  useEffect(() => {
    if (!isLoading && messages.length > 1 && messages[messages.length - 1].role === "assistant") {
      // Small delay to ensure the UI has updated
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [messages, isLoading])

  // Focus input on initial load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
      }

      setMessages([...newMessages, assistantMessage])

      // Check for ticket creation
      if (data.content.includes("TICKET_CREATED:")) {
        try {
          const ticketMatch = data.content.match(/TICKET_CREATED:({.*?})/)
          if (ticketMatch) {
            const ticketData = JSON.parse(ticketMatch[1])
            const newTicket = addTicket(ticketData)
            console.log("Ticket created:", newTicket)
            setTicketCreated(true)
          }
        } catch (error) {
          console.error("Error handling ticket creation:", error)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto flex flex-col h-screen">
        <Header title="Support Chat">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </Header>

        <Card className="flex flex-col flex-1 min-h-0 mb-6">
          <CardHeader className="border-b flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              AI Support Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-y-auto min-h-0">
            {/* Error Display */}
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  I'm having trouble connecting right now. This might be due to:
                  <ul className="mt-2 ml-4 list-disc">
                    <li>Missing or invalid OpenAI API key</li>
                    <li>Network connectivity issues</li>
                    <li>Service temporarily unavailable</li>
                  </ul>
                  <Button size="sm" variant="outline" onClick={handleRetry} className="mt-3 bg-transparent">
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {messages.length <= 1 && !error && (
              <div className="text-center text-gray-600 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg mb-2">AI Support Assistant</p>
                <p>I'll guide you through creating a support ticket step by step.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-200">
                      <User className="w-4 h-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 mb-4">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {ticketCreated && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Ticket Created Successfully!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your support ticket has been created and saved. You can view it in the dashboard.
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={error ? "Fix the error above to continue..." : "Describe your issue..."}
                disabled={isLoading || !!error}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim() || !!error}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
