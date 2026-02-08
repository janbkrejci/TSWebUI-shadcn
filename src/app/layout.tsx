import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppLayout } from "@/components/app-layout"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TS Web UI - Shadcn Mirror",
  description: "React implementation of TS Web UI components",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden bg-background font-sans text-foreground`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
