export interface Ticket {
  id: string
  userName: string
  email: string
  category: string
  priority: "low" | "medium" | "high"
  status: "backlog" | "in-progress" | "resolved"
  title: string
  description: string
  createdAt: string
  updatedAt?: string
}

export interface TicketFormData {
  userName: string
  email: string
  category: string
  priority: "low" | "medium" | "high"
  title: string
  description: string
}
