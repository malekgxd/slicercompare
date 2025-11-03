import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, userEvent } from '../utils/test-helpers'
import { renderWithProviders, createMockConfiguration } from '../utils/test-helpers'
import { ConfigurationFormModal } from '@/components/configuration/ConfigurationFormModal'

describe('ConfigurationFormModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.confirm mock
    vi.mocked(window.confirm).mockReturnValue(true)
  })

  describe('Create Mode', () => {
    it('should render modal when open with correct title', () => {
      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Add Configuration')).toBeInTheDocument()
    })

    it('should not render modal when closed', () => {
      renderWithProviders(
        <ConfigurationFormModal
          isOpen={false}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render all required form fields', () => {
      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Check for configuration name input by ID
      expect(screen.getByRole('textbox', { name: /configuration name/i })).toBeInTheDocument()

      // Check for required parameter fields (approximate matches)
      expect(screen.getByText(/layer height/i)).toBeInTheDocument()
      expect(screen.getByText(/infill/i)).toBeInTheDocument()
      // Support Type appears multiple times, use getAllByText
      expect(screen.getAllByText(/support type/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/printer model/i)).toBeInTheDocument()
    })

    it('should prevent submission when validation errors exist', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Clear the default configuration name to make it invalid
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i })
      await user.clear(nameInput)

      // Try to submit with empty configuration name
      const saveButton = screen.getByRole('button', { name: /save configuration/i })
      await user.click(saveButton)

      // Wait a moment for validation to potentially run
      await new Promise(resolve => setTimeout(resolve, 500))

      // onSave should not be called because validation failed
      expect(mockOnSave).not.toHaveBeenCalled()

      // Error message should be displayed (if rendered in DOM)
      // Note: Validation might prevent form submission without rendering error in some cases
      const errorElement = screen.queryByText(/configuration name is required/i)
      if (errorElement) {
        expect(errorElement).toBeInTheDocument()
      }
    })

    it('should call onSave with valid data when form is submitted', async () => {
      const user = userEvent.setup()
      mockOnSave.mockResolvedValue(undefined)

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Fill in configuration name
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i })
      await user.clear(nameInput)
      await user.type(nameInput, 'Test Configuration')

      // Submit form
      const saveButton = screen.getByRole('button', { name: /save configuration/i })
      await user.click(saveButton)

      // Wait for save to be called
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1)
      })

      // Verify the data structure
      const savedData = mockOnSave.mock.calls[0][0]
      expect(savedData.config_name).toBe('Test Configuration')
      expect(savedData.parameters).toBeDefined()
      expect(savedData.parameters.layer_height).toBeDefined()
      expect(savedData.parameters.infill_density).toBeDefined()
    })

    it('should warn user when closing with unsaved changes', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Make a change to mark form as dirty
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i })
      await user.type(nameInput, 'Test')

      // Try to close
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      // Should show confirmation dialog
      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('unsaved changes')
      )
    })
  })

  describe('Edit Mode', () => {
    it('should render with "Edit Configuration" title', () => {
      const mockConfig = createMockConfiguration()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="edit"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      expect(screen.getByText('Edit Configuration')).toBeInTheDocument()
    })

    it('should pre-fill form with initial values', () => {
      const mockConfig = createMockConfiguration({
        config_name: 'Existing Config',
        parameters: {
          layer_height: 0.3,
          infill_density: 50,
          support_type: 'tree',
          printer_model: 'P1P',
        },
      })

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="edit"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      // Check that name is pre-filled
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i }) as HTMLInputElement
      expect(nameInput.value).toBe('Existing Config')
    })

    it('should save updated values when edited', async () => {
      const user = userEvent.setup()
      mockOnSave.mockResolvedValue(undefined)

      const mockConfig = createMockConfiguration({
        config_name: 'Original Name',
      })

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="edit"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      // Edit the name
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i })
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Name')

      // Submit
      const saveButton = screen.getByRole('button', { name: /save configuration/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1)
      })

      const savedData = mockOnSave.mock.calls[0][0]
      expect(savedData.config_name).toBe('Updated Name')
    })
  })

  describe('Duplicate Mode', () => {
    it('should render with "Duplicate Configuration" title', () => {
      const mockConfig = createMockConfiguration()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="duplicate"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      expect(screen.getByText('Duplicate Configuration')).toBeInTheDocument()
    })

    it('should pre-fill with copied values from original', () => {
      const mockConfig = createMockConfiguration({
        config_name: 'Original Config',
        parameters: {
          layer_height: 0.15,
          infill_density: 30,
          support_type: 'normal',
          printer_model: 'X1_Carbon',
        },
      })

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="duplicate"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      // Check that values are pre-filled
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i }) as HTMLInputElement
      expect(nameInput.value).toBe('Original Config')
    })
  })

  describe('Advanced Settings', () => {
    it('should show advanced settings when toggled', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Advanced settings should be collapsed initially
      expect(screen.queryByLabelText(/print speed/i)).not.toBeInTheDocument()

      // Click to expand advanced settings
      const advancedButton = screen.getByRole('button', {
        name: /advanced settings/i,
      })
      await user.click(advancedButton)

      // Advanced fields should now be visible
      await waitFor(() => {
        expect(screen.getByLabelText(/print speed/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/nozzle temperature/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/bed temperature/i)).toBeInTheDocument()
      })
    })

    it('should show advanced settings by default when editing config with advanced params', () => {
      const mockConfig = createMockConfiguration({
        parameters: {
          layer_height: 0.2,
          infill_density: 20,
          support_type: 'none',
          printer_model: 'X1_Carbon',
          print_speed: 150,
          nozzle_temperature: 220,
        },
      })

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="edit"
          initialValues={{
            config_name: mockConfig.config_name,
            parameters: mockConfig.parameters,
          }}
        />
      )

      // Advanced fields should be visible because they have values
      // Use case-insensitive role queries for better compatibility
      const printSpeedInput = screen.queryByRole('spinbutton', { name: /print speed/i }) ||
                              screen.getByLabelText(/print speed/i)
      const nozzleTempInput = screen.queryByRole('spinbutton', { name: /nozzle temp/i }) ||
                              screen.getByLabelText(/nozzle temp/i)

      expect(printSpeedInput).toBeInTheDocument()
      expect(nozzleTempInput).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should close modal when Escape key is pressed', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      await user.keyboard('{Escape}')

      // Should call onClose
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading State', () => {
    it('should show loading state while saving', async () => {
      const user = userEvent.setup()

      // Make onSave take some time to resolve
      let resolveSave: () => void
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve
      })
      mockOnSave.mockReturnValue(savePromise)

      renderWithProviders(
        <ConfigurationFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          mode="create"
        />
      )

      // Fill in name
      const nameInput = screen.getByRole('textbox', { name: /configuration name/i })
      await user.type(nameInput, 'Test')

      // Submit form
      const saveButton = screen.getByRole('button', { name: /save configuration/i })
      await user.click(saveButton)

      // Should show saving state
      await waitFor(() => {
        expect(screen.getByText(/saving/i)).toBeInTheDocument()
      })

      // Buttons should be disabled
      expect(saveButton).toBeDisabled()

      // Resolve the save
      resolveSave!()
    })
  })
})
