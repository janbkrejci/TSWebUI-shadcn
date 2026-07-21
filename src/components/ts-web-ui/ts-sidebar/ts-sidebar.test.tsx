import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

// next/navigation is not available in the test environment; mock usePathname so
// we can drive the "active route" logic. The variable is read lazily inside the
// factory (name prefixed with `mock` per vitest hoisting rules).
let mockPathname = "/"
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

import type { NavSection } from "./index"
import { Sidebar, SidebarContent, SidebarItem, SidebarProvider, SidebarTrigger } from "./index"

const navigation: NavSection[] = [
  {
    title: "General",
    items: [
      { name: "dashboard", href: "/dashboard", label: "Dashboard", icon: <span /> },
      { name: "reports", href: "/reports", label: "Reports", icon: <span /> },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "profile", href: "/settings/profile", label: "Profile", icon: <span /> },
      { name: "billing", href: "/settings/billing", label: "Billing", icon: <span /> },
    ],
  },
]

function renderSidebar(props: { collapsibleSections?: boolean } = {}) {
  return render(
    <SidebarProvider defaultOpen={true}>
      <Sidebar navigation={navigation} collapsibleSections={props.collapsibleSections} />
    </SidebarProvider>
  )
}

describe("TsSidebar", () => {
  beforeEach(() => {
    mockPathname = "/"
    // The sidebar persists its open/collapsed state to localStorage; clear it so one test's
    // toggle can't leak into the next (a closed state hides the collapse control).
    window.localStorage.clear()
  })

  it("toggles sidebar when trigger is clicked", () => {
    render(
      <SidebarProvider defaultOpen={true}>
        <SidebarTrigger />
        <Sidebar>
          <SidebarContent>
            <SidebarItem>Item 1</SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    const trigger = screen.getByLabelText(/Close menu/i)
    expect(screen.getByText("Item 1")).toBeInTheDocument()

    fireEvent.click(trigger)

    // In our implementation, width goes to 0 when closed
    const sidebar = screen.getByRole("complementary")
    expect(sidebar).toHaveStyle({ width: "0px" })
  })

  describe("collapsibleSections", () => {
    // Folded content stays mounted (so the height can animate and nothing pops when the whole
    // sidebar collapses); "folded" therefore means the items' panel is aria-hidden, not removed.
    const panelFor = (name: RegExp) => {
      const btn = screen.getByRole("button", { name })
      return document.getElementById(btn.getAttribute("aria-controls") as string)
    }

    it("renders section titles as accordion buttons and folds all sections by default", () => {
      renderSidebar({ collapsibleSections: true })

      const generalBtn = screen.getByRole("button", { name: /General/i })
      const settingsBtn = screen.getByRole("button", { name: /Settings/i })

      // Titles are buttons exposing aria-expanded
      expect(generalBtn).toHaveAttribute("aria-expanded", "false")
      expect(settingsBtn).toHaveAttribute("aria-expanded", "false")

      // No active route ("/") -> every section is folded, so no items are rendered
      expect(panelFor(/General/i)).toHaveAttribute("aria-hidden", "true")
      expect(panelFor(/Settings/i)).toHaveAttribute("aria-hidden", "true")
    })

    it("reveals a section's items when its title is clicked and folds the others (single-open)", () => {
      renderSidebar({ collapsibleSections: true })

      fireEvent.click(screen.getByRole("button", { name: /General/i }))

      // General is now open, its items are visible
      expect(screen.getByRole("button", { name: /General/i })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Reports")).toBeInTheDocument()
      // Settings remains folded
      expect(panelFor(/Settings/i)).toHaveAttribute("aria-hidden", "true")

      // Opening Settings must fold General (only one open at a time)
      fireEvent.click(screen.getByRole("button", { name: /Settings/i }))

      expect(screen.getByRole("button", { name: /Settings/i })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
      expect(screen.getByRole("button", { name: /General/i })).toHaveAttribute(
        "aria-expanded",
        "false"
      )
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(panelFor(/General/i)).toHaveAttribute("aria-hidden", "true")

      // Clicking the open section folds it -> none open
      fireEvent.click(screen.getByRole("button", { name: /Settings/i }))
      expect(screen.getByRole("button", { name: /Settings/i })).toHaveAttribute(
        "aria-expanded",
        "false"
      )
      expect(panelFor(/Settings/i)).toHaveAttribute("aria-hidden", "true")
    })

    it("links the header button to its items container via aria-controls", () => {
      renderSidebar({ collapsibleSections: true })

      fireEvent.click(screen.getByRole("button", { name: /General/i }))
      const generalBtn = screen.getByRole("button", { name: /General/i })
      const controlsId = generalBtn.getAttribute("aria-controls")

      expect(controlsId).toBeTruthy()
      const container = document.getElementById(controlsId as string)
      expect(container).not.toBeNull()
      expect(container).toContainElement(screen.getByText("Dashboard"))
    })

    it("auto-expands the section containing the active route on mount", () => {
      mockPathname = "/settings/profile"
      renderSidebar({ collapsibleSections: true })

      expect(screen.getByRole("button", { name: /Settings/i })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
      expect(screen.getByRole("button", { name: /General/i })).toHaveAttribute(
        "aria-expanded",
        "false"
      )
      // Active section's items are visible; the other section's are hidden
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(screen.getByText("Billing")).toBeInTheDocument()
      expect(panelFor(/General/i)).toHaveAttribute("aria-hidden", "true")
    })

    it("keeps the accordion when icon-collapsed — only the open section's items stay visible", () => {
      // Desktop width so the sidebar is not in mobile mode (the collapse control only exists there).
      window.innerWidth = 1024
      mockPathname = "/settings/profile"
      renderSidebar({ collapsibleSections: true })

      // Collapse the whole sidebar to the icon-only rail.
      fireEvent.click(screen.getByLabelText(/collapse menu|sbalit menu/i))

      // No accordion toggle headers survive in icon mode (no room for the labels).
      expect(screen.queryByRole("button", { name: /General/i })).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /Settings/i })).not.toBeInTheDocument()

      // The open section (Settings = active route) keeps its item icons; the folded section
      // (General) stays hidden — mirroring the wide sidebar rather than expanding everything.
      expect(screen.getByText("Profile").closest("[aria-hidden]")).toHaveAttribute(
        "aria-hidden",
        "false"
      )
      expect(screen.getByText("Dashboard").closest("[aria-hidden]")).toHaveAttribute(
        "aria-hidden",
        "true"
      )
    })
  })

  describe("without collapsibleSections", () => {
    it("keeps every section's items visible and renders no toggle buttons", () => {
      renderSidebar()

      // Titles render as plain headings, not buttons
      expect(screen.getByText("General")).toBeInTheDocument()
      expect(screen.getByText("Settings")).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /General/i })).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: /Settings/i })).not.toBeInTheDocument()

      // All items are visible regardless of the active route
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Reports")).toBeInTheDocument()
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(screen.getByText("Billing")).toBeInTheDocument()
    })
  })
})
