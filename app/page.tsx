"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Settings } from "lucide-react"
import { Header } from "@/components/layout/header"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header title="AI Support Center" />

        <div className="text-center mb-12">
          <p className="text-xl text-gray-600">Get help instantly with our AI-powered support assistant</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Need Help?</CardTitle>
              <CardDescription className="text-lg">
                Chat with our AI assistant to create a support ticket
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/chat">
                <Button size="lg" className="w-full">
                  Start Chat
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Support Tech</CardTitle>
              <CardDescription className="text-lg px-3">Manage and view support tickets from users</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
