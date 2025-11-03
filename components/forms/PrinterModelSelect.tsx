'use client'

import { PRINTER_MODELS, type PrinterModel } from '@/utils/validation'

interface PrinterModelSelectProps {
  value: PrinterModel
  onChange: (value: PrinterModel) => void
  error?: string
  id?: string
  label?: string
  required?: boolean
}

const printerOptions = [
  { value: 'X1_Carbon', label: 'Bambu Lab X1 Carbon', buildVolume: '256×256×256mm' },
  { value: 'P1P', label: 'Bambu Lab P1P', buildVolume: '256×256×256mm' },
  { value: 'P1S', label: 'Bambu Lab P1S', buildVolume: '256×256×256mm' },
  { value: 'A1_Mini', label: 'Bambu Lab A1 Mini', buildVolume: '180×180×180mm' }
] as const

export function PrinterModelSelect({
  value,
  onChange,
  error,
  id = 'printer-model',
  label = 'Printer Model',
  required = true
}: PrinterModelSelectProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-error-500)] ml-1" aria-label="required">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as PrinterModel)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-[var(--color-text-primary)] bg-[var(--color-background-primary)] ${
          error
            ? 'border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]'
            : 'border-[var(--color-neutral-400)] focus:ring-[var(--color-primary-500)]'
        }`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : `${id}-help`}
        required={required}
      >
        {printerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[var(--color-error-600)]" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-help`} className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Build volume: <span className="font-semibold">{printerOptions.find(opt => opt.value === value)?.buildVolume}</span>
        </p>
      )}
    </div>
  )
}
