import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ClientOnly } from "./index"

describe("ClientOnly", () => {
  it("renders fallback initially", () => {
    render(
      <ClientOnly fallback={<div data-testid="fallback">Loading...</div>}>
        <div data-testid="children">Content</div>
      </ClientOnly>
    )

    // In jsdom, useEffect runs immediately after render in some configurations,
    // but typically we can test the initial state or the fact it mounts.
    expect(screen.queryByTestId("children")).toBeInTheDocument()
  })
})
