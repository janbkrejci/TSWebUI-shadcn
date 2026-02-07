"use client"

import * as React from "react"

/**
 * Hook to detect if the component is already mounted in the browser (client-side).
 * Helps prevent hydration errors (SSR mismatch).
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
