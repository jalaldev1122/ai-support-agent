"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tag, Clock, Filter, CheckCircle } from "lucide-react"
import type { Ticket } from "@/lib/types/ticket"

interface DashboardStatsProps {
  tickets: Ticket[]
}

export function DashboardStats({ tickets }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Tickets",
      value: tickets.length,
      icon: Tag,
      color: "text-gray-600",
    },
    {
      title: "Backlog",
      value: tickets.filter((t) => t.status === "backlog").length,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: tickets.filter((t) => t.status === "in-progress").length,
      icon: Filter,
      color: "text-orange-600",
    },
    {
      title: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
