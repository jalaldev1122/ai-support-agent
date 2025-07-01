"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types/ticket"
import { TicketCard } from "./ticket-card"
import { useDroppable } from "@dnd-kit/core"

interface KanbanColumnProps {
  title: string
  status: Ticket["status"]
  tickets: Ticket[]
  color: string
  onTicketClick?: (ticket: Ticket) => void
}

export function KanbanColumn({ title, status, tickets, color, onTicketClick }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            {title}
          </span>
          <Badge variant="secondary" className="text-xs">
            {tickets.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={setNodeRef}
          className={`min-h-[400px] space-y-3 p-2 rounded-lg transition-colors ${isOver ? "bg-muted/50" : ""}`}
        >
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={() => onTicketClick?.(ticket)} />
          ))}
          {tickets.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">No tickets</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
