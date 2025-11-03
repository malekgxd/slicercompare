'use client'

import { SUPPORT_TYPES, type SupportType } from '@/utils/validation'

interface SupportTypeSelectProps {
  value: SupportType
  onChange: (value: SupportType) => void
  error?: string
  id?: string
  label?: string
  required?: boolean
}

const supportOptions = [
  { value: 'none', label: 'No Supports', description: 'Print without support material' },
  { value: 'normal', label: 'Normal Supports', description: 'Standard grid-pattern supports' },
  { value: 'tree', label: 'Tree Supports', description: 'Organic tree-style supports (easier to remove)' }
] as const

export function SupportTypeSelect({
  value,
  onChange,
  error,
  id = 'support-type',
  label = 'Support Type',
  required = true
}: SupportTypeSelectProps) {
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
        onChange={(e) => onChange(e.target.value as SupportType)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-[var(--color-text-primary)] bg-[var(--color-background-primary)] ${
          error
            ? 'border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]'
            : 'border-[var(--color-neutral-400)] focus:ring-[var(--color-primary-500)]'
        }`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : `${id}-help`}
        required={required}
      >
        {supportOptions.map((option) => (
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
          {supportOptions.find(opt => opt.value === value)?.description}
        </p>
      )}
    </div>
  )
}
