import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import type { Configuration, ConfigurationParameters } from '@/types/database'

/**
 * Custom render function that wraps @testing-library/react render
 * Can be extended to include providers (Router, Context, etc.) if needed
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Mock factory for creating test Configuration objects
 */
export function createMockConfiguration(
  overrides?: Partial<Configuration>
): Configuration {
  const defaultParams: ConfigurationParameters = {
    layer_height: 0.2,
    infill_density: 20,
    support_type: 'none',
    printer_model: 'X1_Carbon',
  }

  return {
    config_id: 'test-config-123',
    session_id: 'test-session-456',
    config_name: 'Test Configuration',
    parameters: defaultParams,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Mock factory for creating test ConfigurationParameters
 */
export function createMockParameters(
  overrides?: Partial<ConfigurationParameters>
): ConfigurationParameters {
  return {
    layer_height: 0.2,
    infill_density: 20,
    support_type: 'none',
    printer_model: 'X1_Carbon',
    ...overrides,
  }
}

/**
 * Wait for a specific amount of time (useful for async tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Helper to create mock file for upload testing
 */
export function createMockFile(
  name: string = 'test.stl',
  type: string = 'application/vnd.ms-pki.stl',
  size: number = 1024
): File {
  const blob = new Blob(['test content'], { type })
  return new File([blob], name, { type })
}

// Re-export commonly used testing utilities
export { screen, waitFor, within } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
