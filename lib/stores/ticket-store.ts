"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Ticket, TicketFormData } from "@/lib/types/ticket"

interface TicketStore {
  tickets: Ticket[]
  addTicket: (ticketData: TicketFormData) => Ticket
  updateTicketStatus: (ticketId: string, status: Ticket["status"]) => void
  getTicketsByStatus: (status: Ticket["status"]) => Ticket[]
  getAllCategories: () => string[]
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],

      addTicket: (ticketData: TicketFormData) => {
        const newTicket: Ticket = {
          id: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...ticketData,
          status: "backlog",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          tickets: [...state.tickets, newTicket],
        }))

        return newTicket
      },

      updateTicketStatus: (ticketId: string, status: Ticket["status"]) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket,
          ),
        }))
      },

      getTicketsByStatus: (status: Ticket["status"]) => {
        return get().tickets.filter((ticket) => ticket.status === status)
      },

      getAllCategories: () => {
        const categories = get().tickets.map((ticket) => ticket.category)
        return [...new Set(categories)]
      },
    }),
    {
      name: "support-tickets-storage",
    },
  ),
)
