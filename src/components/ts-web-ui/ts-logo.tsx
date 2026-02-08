"use client"

import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo text */
  text?: string
  /** Logo icon or element */
  icon?: React.ReactNode
  /** URL for link (if provided, logo will be a link) */
  href?: string
}

/**
 * Universal Logo component for Sidebar and TopBar
 */
export function Logo({ className, text, icon, href, children, ...props }: LogoProps) {
  const content = (
    <>
      {icon}
      {text && <span className="truncate">{text}</span>}
      {children}
    </>
  )

  const classes = cn(
    "flex items-center gap-2 font-semibold text-lg tracking-tight",
    href && "hover:opacity-80 transition-opacity",
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as unknown as React.ComponentProps<typeof Link>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={classes} {...props}>
      {content}
    </div>
  )
}
