"use client"

import * as React from "react"

/**
 * Hook pro detekci, zda je komponenta již namontována v prohlížeči (client-side).
 * Pomáhá předcházet chybám při hydrataci (SSR mismatch).
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
