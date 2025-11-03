import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test case (unmount React components, etc.)
afterEach(() => {
  cleanup()
})

// Mock window.confirm for tests that need it
global.confirm = vi.fn(() => true)

// Mock window.alert
global.alert = vi.fn()

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
