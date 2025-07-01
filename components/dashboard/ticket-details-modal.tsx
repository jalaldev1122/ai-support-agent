"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Calendar, Tag, AlertCircle, FileText } from "lucide-react"
import type { Ticket } from "@/lib/types/ticket"
import { useTicketStore } from "@/lib/stores/ticket-store"

interface TicketDetailsModalProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketDetailsModal({ ticket, open, onOpenChange }: TicketDetailsModalProps) {
  const updateTicketStatus = useTicketStore((state) => state.updateTicketStatus)

  if (!ticket) {
    return null
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (newStatus: Ticket["status"]) => {
    updateTicketStatus(ticket.id, newStatus)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ticket Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Header */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
              <p className="text-sm text-gray-600">ID: {ticket.id}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                <AlertCircle className="w-3 h-3 mr-1" />
                {ticket.priority.toUpperCase()} Priority
              </Badge>
              <Badge className={getStatusColor(ticket.status)} variant="secondary">
                {ticket.status.replace("-", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline">
                <Tag className="w-3 h-3 mr-1" />
                {ticket.category}
              </Badge>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{ticket.userName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{ticket.email}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Issue Description</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Update Status</h4>
            <div className="flex items-center gap-4">
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">
                Change the ticket status to update its position on the board
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
