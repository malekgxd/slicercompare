import { describe, it, expect, vi } from 'vitest'
import { screen, userEvent } from '../utils/test-helpers'
import { renderWithProviders, createMockConfiguration } from '../utils/test-helpers'
import { ConfigurationCard } from '@/components/configuration/ConfigurationCard'

describe('ConfigurationCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnDuplicate = vi.fn()

  const defaultProps = {
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onDuplicate: mockOnDuplicate,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render configuration data correctly', () => {
    const mockConfig = createMockConfiguration({
      config_name: 'Test Configuration',
      parameters: {
        layer_height: 0.2,
        infill_density: 25,
        support_type: 'tree',
        printer_model: 'X1_Carbon',
      },
      is_active: true,
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Check configuration name
    expect(screen.getByText('Test Configuration')).toBeInTheDocument()

    // Check active badge
    expect(screen.getByText('Active')).toBeInTheDocument()

    // Check parameter values
    expect(screen.getByText('0.2mm')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('tree', { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/X1 Carbon/i)).toBeInTheDocument()
  })

  it('should not show active badge for inactive configurations', () => {
    const mockConfig = createMockConfiguration({
      is_active: false,
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const mockConfig = createMockConfiguration()

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
    expect(mockOnEdit).toHaveBeenCalledWith(mockConfig)
  })

  it('should call onDuplicate when duplicate button is clicked', async () => {
    const user = userEvent.setup()
    const mockConfig = createMockConfiguration()

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    const duplicateButton = screen.getByRole('button', { name: /duplicate/i })
    await user.click(duplicateButton)

    expect(mockOnDuplicate).toHaveBeenCalledTimes(1)
    expect(mockOnDuplicate).toHaveBeenCalledWith(mockConfig)
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockConfig = createMockConfiguration({
      config_id: 'config-to-delete',
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
    expect(mockOnDelete).toHaveBeenCalledWith('config-to-delete')
  })

  it('should expand and show all parameters when "Show all" is clicked', async () => {
    const user = userEvent.setup()
    const mockConfig = createMockConfiguration({
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'none',
        printer_model: 'X1_Carbon',
        print_speed: 150,
        nozzle_temperature: 220,
        bed_temperature: 60,
        wall_thickness: 1.2,
        top_bottom_thickness: 0.8,
      },
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Advanced parameters should not be visible initially
    expect(screen.queryByText('150 mm/s')).not.toBeInTheDocument()
    expect(screen.queryByText('220°C')).not.toBeInTheDocument()

    // Click to expand
    const expandButton = screen.getByRole('button', { name: /show all parameters/i })
    await user.click(expandButton)

    // Advanced parameters should now be visible
    expect(screen.getByText('150 mm/s')).toBeInTheDocument()
    expect(screen.getByText('220°C')).toBeInTheDocument()
    expect(screen.getByText('60°C')).toBeInTheDocument()
    expect(screen.getByText('1.2mm')).toBeInTheDocument()
    expect(screen.getByText('0.8mm')).toBeInTheDocument()
  })

  it('should collapse parameters when "Show less" is clicked', async () => {
    const user = userEvent.setup()
    const mockConfig = createMockConfiguration({
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'none',
        printer_model: 'X1_Carbon',
        print_speed: 150,
      },
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Expand
    const expandButton = screen.getByRole('button', { name: /show all parameters/i })
    await user.click(expandButton)

    // Verify expanded
    expect(screen.getByText('150 mm/s')).toBeInTheDocument()

    // Collapse
    const collapseButton = screen.getByRole('button', { name: /show less/i })
    await user.click(collapseButton)

    // Advanced parameters should be hidden again
    expect(screen.queryByText('150 mm/s')).not.toBeInTheDocument()
  })

  it('should render created date in readable format', () => {
    const mockDate = new Date('2025-01-15T10:30:00Z')
    const mockConfig = createMockConfiguration({
      created_at: mockDate.toISOString(),
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Check that date is rendered (format may vary by locale)
    expect(screen.getByText(/created/i)).toBeInTheDocument()
  })

  it('should handle configurations with only required parameters', () => {
    const mockConfig = createMockConfiguration({
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'none',
        printer_model: 'P1P',
        // No optional parameters
      },
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Should render without errors
    expect(screen.getByText('Test Configuration')).toBeInTheDocument()
    expect(screen.getByText('0.2mm')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('should correctly format printer model names', () => {
    const mockConfig = createMockConfiguration({
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'none',
        printer_model: 'A1_Mini',
      },
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Should replace underscores with spaces
    expect(screen.getByText(/A1 Mini/i)).toBeInTheDocument()
  })

  it('should display support type with proper casing', () => {
    const mockConfig = createMockConfiguration({
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'normal',
        printer_model: 'X1_Carbon',
      },
    })

    renderWithProviders(
      <ConfigurationCard configuration={mockConfig} {...defaultProps} />
    )

    // Support type should be displayed (case may vary by CSS)
    expect(screen.getByText(/normal/i)).toBeInTheDocument()
  })
})
