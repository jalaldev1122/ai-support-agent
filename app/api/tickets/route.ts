import { NextResponse } from "next/server"

// In a real application, you would use a database
// For this demo, we'll simulate ticket storage
const tickets: any[] = []

export async function GET() {
  return NextResponse.json(tickets)
}

export async function POST(request: Request) {
  try {
    const ticketData = await request.json()

    const ticket = {
      id: `TICKET-${Date.now()}`,
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString(),
    }

    tickets.push(ticket)

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
