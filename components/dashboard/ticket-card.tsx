"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar } from "lucide-react"
import type { Ticket } from "@/lib/types/ticket"
import { useDraggable } from "@dnd-kit/core"

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Title clicked:", ticket.id, ticket.title)
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className={`transition-all ${isDragging ? "opacity-50 rotate-3 scale-105" : ""}`}>
      <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle
              className="text-sm font-medium line-clamp-2 hover:text-blue-600 cursor-pointer hover:underline"
              onClick={handleTitleClick}
            >
              {ticket.title}
            </CardTitle>
            <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
              {ticket.priority}
            </Badge>
          </div>
        </CardHeader>

        {/* Draggable area - everything except the title */}
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                {ticket.category}
              </Badge>
              <p className="text-xs text-gray-600 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {ticket.userName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
