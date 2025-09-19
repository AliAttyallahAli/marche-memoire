"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number
  children?: React.ReactNode
}

export function CircularProgress({ value, children, className, ...props }: CircularProgressProps) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-muted"
                strokeWidth="10"
            />
            <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-primary transition-all duration-300"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
            />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
            {children}
        </div>
    </div>
  )
}
