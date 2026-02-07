import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Sidebar, SidebarContent, SidebarItem, SidebarProvider, SidebarTrigger } from "./index"

describe("TsSidebar", () => {
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

    const trigger = screen.getByLabelText(/Zavřít menu/i)
    expect(screen.getByText("Item 1")).toBeInTheDocument()

    fireEvent.click(trigger)

    // In our implementation, width goes to 0 when closed
    const sidebar = screen.getByRole("complementary")
    expect(sidebar).toHaveStyle({ width: "0px" })
  })
})
