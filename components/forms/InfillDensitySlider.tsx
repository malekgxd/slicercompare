'use client'

import { INFILL_MIN, INFILL_MAX } from '@/utils/validation'

interface InfillDensitySliderProps {
  value: number
  onChange: (value: number) => void
  error?: string
  id?: string
  label?: string
  required?: boolean
}

export function InfillDensitySlider({
  value,
  onChange,
  error,
  id = 'infill-density',
  label = 'Infill Density',
  required = true
}: InfillDensitySliderProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-error-500)] ml-1" aria-label="required">*</span>}
        <span className="ml-2 text-[var(--color-primary-600)] font-semibold">{value}%</span>
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--color-text-tertiary)]">{INFILL_MIN}%</span>
        <input
          type="range"
          id={id}
          min={INFILL_MIN}
          max={INFILL_MAX}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
            error
              ? 'accent-[var(--color-error-500)]'
              : 'accent-[var(--color-primary-600)]'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : `${id}-help`}
          required={required}
        />
        <span className="text-sm text-[var(--color-text-tertiary)]">{INFILL_MAX}%</span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[var(--color-error-600)]" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-help`} className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Higher values = stronger part, more material, longer print time
        </p>
      )}
    </div>
  )
}
