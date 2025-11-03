'use client'

import { useState, useEffect, useRef } from 'react'
import type { Configuration } from '@/types/database'
import type { ConfigurationParameters } from '@/types/database'
import { ConfigurationNameInput } from '@/components/forms/ConfigurationNameInput'
import { LayerHeightSlider } from '@/components/forms/LayerHeightSlider'
import { InfillDensitySlider } from '@/components/forms/InfillDensitySlider'
import { SupportTypeSelect } from '@/components/forms/SupportTypeSelect'
import { PrinterModelSelect } from '@/components/forms/PrinterModelSelect'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { validateConfiguration, hasValidationErrors, type ValidationErrors } from '@/utils/validation'

interface ConfigurationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: ConfigurationFormData) => Promise<void>
  initialValues?: Partial<ConfigurationFormData>
  mode?: 'create' | 'edit' | 'duplicate'
}

export interface ConfigurationFormData {
  config_name: string
  parameters: ConfigurationParameters
}

const defaultFormData: ConfigurationFormData = {
  config_name: '',
  parameters: {
    layer_height: 0.2,
    infill_density: 20,
    support_type: 'none',
    printer_model: 'X1_Carbon'
  }
}

export function ConfigurationFormModal({
  isOpen,
  onClose,
  onSave,
  initialValues,
  mode = 'create'
}: ConfigurationFormModalProps) {
  const [formData, setFormData] = useState<ConfigurationFormData>(defaultFormData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  // Initialize form data when modal opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setFormData({
          config_name: initialValues.config_name || '',
          parameters: initialValues.parameters || defaultFormData.parameters
        })
        // Show advanced if any optional parameters are set
        const hasAdvancedParams = initialValues.parameters && (
          initialValues.parameters.print_speed ||
          initialValues.parameters.nozzle_temperature ||
          initialValues.parameters.bed_temperature ||
          initialValues.parameters.wall_thickness ||
          initialValues.parameters.top_bottom_thickness
        )
        setShowAdvanced(!!hasAdvancedParams)
      } else {
        setFormData(defaultFormData)
        setShowAdvanced(false)
      }
      setErrors({})
      setIsDirty(false)
    }
  }, [isOpen, initialValues])

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && formRef.current) {
      const firstInput = formRef.current.querySelector('input')
      firstInput?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isDirty])

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Discard them?')
      if (!confirmed) return
    }
    onClose()
  }

  const handleChange = <K extends keyof ConfigurationFormData>(
    field: K,
    value: ConfigurationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)

    // Clear error for this field
    if (field in errors) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as keyof ValidationErrors]
        return newErrors
      })
    }
  }

  const handleParameterChange = <K extends keyof ConfigurationParameters>(
    param: K,
    value: ConfigurationParameters[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }))
    setIsDirty(true)

    // Clear error for this parameter
    if (param in errors) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[param as keyof ValidationErrors]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const validationErrors = validateConfiguration({
      config_name: formData.config_name,
      ...formData.parameters
    })

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    // Save
    setIsSaving(true)
    try {
      await onSave(formData)
      setIsDirty(false)
      onClose()
    } catch (error) {
      console.error('Failed to save configuration:', error)
      // Error handling happens in parent component (toast notification)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const modalTitle = {
    create: 'Add Configuration',
    edit: 'Edit Configuration',
    duplicate: 'Duplicate Configuration'
  }[mode]

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--color-neutral-900)] bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={formRef}
          className="relative transform overflow-hidden rounded-lg bg-[var(--color-background-primary)] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl animate-fade-in"
        >
          {/* Header */}
          <div className="bg-[var(--color-background-primary)] px-6 py-4 border-b border-[var(--color-neutral-300)]">
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-[var(--color-text-primary)]"
              >
                {modalTitle}
              </h3>
              <button
                onClick={handleClose}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] rounded-lg"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[var(--color-background-primary)] px-6 py-6">
            <div className="space-y-6">
              {/* Configuration Name */}
              <ConfigurationNameInput
                value={formData.config_name}
                onChange={(value) => handleChange('config_name', value)}
                error={errors.config_name}
              />

              {/* Layer Height */}
              <LayerHeightSlider
                value={formData.parameters.layer_height}
                onChange={(value) => handleParameterChange('layer_height', value)}
                error={errors.layer_height}
              />

              {/* Infill Density */}
              <InfillDensitySlider
                value={formData.parameters.infill_density}
                onChange={(value) => handleParameterChange('infill_density', value)}
                error={errors.infill_density}
              />

              {/* Support Type */}
              <SupportTypeSelect
                value={formData.parameters.support_type}
                onChange={(value) => handleParameterChange('support_type', value)}
                error={errors.support_type}
              />

              {/* Printer Model */}
              <PrinterModelSelect
                value={formData.parameters.printer_model}
                onChange={(value) => handleParameterChange('printer_model', value)}
                error={errors.printer_model}
              />

              {/* Advanced Settings (Collapsible) */}
              <div className="border-t border-[var(--color-neutral-300)] pt-6">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]"
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Advanced Settings (Optional)
                </button>

                {showAdvanced && (
                  <div className="mt-6 space-y-6 pl-7">
                    {/* Print Speed */}
                    <div>
                      <label htmlFor="print-speed" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        Print Speed
                      </label>
                      <input
                        type="number"
                        id="print-speed"
                        value={formData.parameters.print_speed || ''}
                        onChange={(e) => handleParameterChange('print_speed', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-[var(--color-neutral-400)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)]"
                        placeholder="e.g., 100"
                        min={50}
                        max={500}
                      />
                      {errors.print_speed && (
                        <p className="mt-2 text-sm text-[var(--color-error-600)]">{errors.print_speed}</p>
                      )}
                    </div>

                    {/* Nozzle Temperature */}
                    <div>
                      <label htmlFor="nozzle-temp" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        Nozzle Temperature (°C)
                      </label>
                      <input
                        type="number"
                        id="nozzle-temp"
                        value={formData.parameters.nozzle_temperature || ''}
                        onChange={(e) => handleParameterChange('nozzle_temperature', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        className="w-full px-3 py-2 border border-[var(--color-neutral-400)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)]"
                        placeholder="e.g., 220"
                        min={180}
                        max={300}
                      />
                      {errors.nozzle_temperature && (
                        <p className="mt-2 text-sm text-[var(--color-error-600)]">{errors.nozzle_temperature}</p>
                      )}
                    </div>

                    {/* Bed Temperature */}
                    <div>
                      <label htmlFor="bed-temp" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        Bed Temperature (°C)
                      </label>
                      <input
                        type="number"
                        id="bed-temp"
                        value={formData.parameters.bed_temperature || ''}
                        onChange={(e) => handleParameterChange('bed_temperature', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        className="w-full px-3 py-2 border border-[var(--color-neutral-400)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)]"
                        placeholder="e.g., 60"
                        min={0}
                        max={120}
                      />
                      {errors.bed_temperature && (
                        <p className="mt-2 text-sm text-[var(--color-error-600)]">{errors.bed_temperature}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-background-primary)] border border-[var(--color-neutral-400)] rounded-lg hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || hasValidationErrors(errors)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary-600)] rounded-lg hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <LoadingSpinner size="sm" />}
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
