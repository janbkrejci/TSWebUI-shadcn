import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useWindowManager, WindowOutlet, WindowProvider } from "./index"

// Mock Window Manager for basic window testing
const TestApp = () => {
  const { openWindow } = useWindowManager()
  return (
    <div>
      <button
        onClick={() =>
          openWindow(<div data-testid="window-content">Hello</div>, {
            id: "test",
            title: "Test Window",
          })
        }
      >
        Open
      </button>
      <WindowOutlet />
    </div>
  )
}

describe("TsWindow", () => {
  it("opens a window via window manager", async () => {
    render(
      <WindowProvider>
        <TestApp />
      </WindowProvider>
    )

    fireEvent.click(screen.getByText("Open"))

    expect(await screen.findByText("Test Window")).toBeInTheDocument()
    expect(screen.getByTestId("window-content")).toBeInTheDocument()
  })

  it("renders with correct title", async () => {
    render(
      <WindowProvider>
        <TestApp />
      </WindowProvider>
    )

    fireEvent.click(screen.getByText("Open"))
    const title = await screen.findByText("Test Window")
    expect(title).toBeInTheDocument()
  })
})
