/// <reference types="vitest/globals" />
import "@testing-library/jest-dom"

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: mirrors jest generic signature
  export interface Assertion<T = any> extends jest.Matchers<void, T> {
    _neverUsed?: T
  }
  // biome-ignore lint/suspicious/noExplicitAny: mirrors jest generic signature
  export interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {
    // biome-ignore lint/suspicious/noExplicitAny: mirrors jest generic signature
    _neverUsed?: any
  }
}
