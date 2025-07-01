"use client"

import type React from "react"

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between my-6">
      <div className="flex items-center gap-4">
        {children}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
    </div>
  )
}
