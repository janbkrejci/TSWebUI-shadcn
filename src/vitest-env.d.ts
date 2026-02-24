/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />
import "@testing-library/jest-dom"

declare module "vitest" {
  export interface Assertion<T = any> extends jest.Matchers<void, T> {
    _neverUsed?: T
  }
  export interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {
    _neverUsed?: any
  }
}
