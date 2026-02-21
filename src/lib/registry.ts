"use client"

/**
 * Gets the base URL for the registry.
 * This is used to build absolute URLs for the shadcn CLI.
 */
export function getRegistryBaseUrl(): string {
  // If we're in the browser, use the current origin
  if (typeof window !== "undefined") {
    // For GitHub Pages, origin is usually https://username.github.io
    // But we need the full path including the repo name
    // e.g., https://janbkrejci.github.io/TSWebUI-shadcn
    const origin = window.location.origin
    const pathname = window.location.pathname

    // Check if we're on GitHub Pages with the /TSWebUI-shadcn prefix
    if (pathname.startsWith("/TSWebUI-shadcn")) {
      return `${origin}/TSWebUI-shadcn/registry`
    }

    // Localhost or custom domain
    return `${origin}/registry`
  }

  // Fallback for SSR or if window is not available
  return "https://janbkrejci.github.io/TSWebUI-shadcn/registry"
}

/**
 * Builds a registry URL for a specific component.
 */
export function getComponentRegistryUrl(componentName: string): string {
  const baseUrl = getRegistryBaseUrl()
  return `${baseUrl}/${componentName}.json`
}
