"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { KanbanColumn } from "@/components/dashboard/kanban-column"
import { TicketDetailsModal } from "@/components/dashboard/ticket-details-modal"
import { useTicketStore } from "@/lib/stores/ticket-store"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { Ticket } from "@/lib/types/ticket"

export default function DashboardPage() {
  const tickets = useTicketStore((state) => state.tickets)
  const updateTicketStatus = useTicketStore((state) => state.updateTicketStatus)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const ticketId = active.id as string
    const newStatus = over.id as Ticket["status"]

    updateTicketStatus(ticketId, newStatus)
  }

  const handleTicketClick = (ticket: Ticket) => {
    console.log("handleTicketClick called with:", ticket.id, ticket.title)
    setSelectedTicket(ticket)
    setModalOpen(true)
  }

  const backlogTickets = tickets.filter((ticket) => ticket.status === "backlog")
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "in-progress")
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Header title="Support Dashboard">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </Header>

        <DashboardStats tickets={tickets} />

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn
              title="Backlog"
              status="backlog"
              tickets={backlogTickets}
              color="bg-blue-500"
              onTicketClick={handleTicketClick}
            />
            <KanbanColumn
              title="In Progress"
              status="in-progress"
              tickets={inProgressTickets}
              color="bg-orange-500"
              onTicketClick={handleTicketClick}
            />
            <KanbanColumn
              title="Resolved"
              status="resolved"
              tickets={resolvedTickets}
              color="bg-green-500"
              onTicketClick={handleTicketClick}
            />
          </div>
        </DndContext>

        <TicketDetailsModal ticket={selectedTicket} open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </div>
  )
}
