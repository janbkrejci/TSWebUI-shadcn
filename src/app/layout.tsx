import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ts-web-ui/ts-sidebar"
import { TopBarLogo, TsTopBar } from "@/components/ts-web-ui/ts-topbar"

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

const TOP_BAR_HEIGHT = 56

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans text-foreground`}
      >
        <ThemeProvider>
          <SidebarProvider defaultOpen={true} mobileBreakpoint={1024} topBarHeight={TOP_BAR_HEIGHT}>
            {/* Fixed TopBar - přes celou šířku */}
            <TsTopBar
              height={TOP_BAR_HEIGHT}
              leftContent={
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <TopBarLogo text="TSWebUI" href="/" />
                </div>
              }
              rightContent={<ModeToggle />}
            />

            {/* Sidebar - pod TopBarem */}
            <Sidebar>
              <SidebarContent>
                <AppSidebar />
              </SidebarContent>
            </Sidebar>

            {/* Main Content Area - automaticky reaguje na sidebar */}
            <SidebarInset className="px-6 py-6">{children}</SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
