'use client'

import { LAYER_HEIGHT_MIN, LAYER_HEIGHT_MAX, LAYER_HEIGHT_STEP } from '@/utils/validation'

interface LayerHeightSliderProps {
  value: number
  onChange: (value: number) => void
  error?: string
  id?: string
  label?: string
  required?: boolean
}

export function LayerHeightSlider({
  value,
  onChange,
  error,
  id = 'layer-height',
  label = 'Layer Height',
  required = true
}: LayerHeightSliderProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-error-500)] ml-1" aria-label="required">*</span>}
        <span className="ml-2 text-[var(--color-primary-600)] font-semibold">{value.toFixed(2)}mm</span>
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--color-text-tertiary)]">{LAYER_HEIGHT_MIN}mm</span>
        <input
          type="range"
          id={id}
          min={LAYER_HEIGHT_MIN}
          max={LAYER_HEIGHT_MAX}
          step={LAYER_HEIGHT_STEP}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
            error
              ? 'accent-[var(--color-error-500)]'
              : 'accent-[var(--color-primary-600)]'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : `${id}-help`}
          required={required}
        />
        <span className="text-sm text-[var(--color-text-tertiary)]">{LAYER_HEIGHT_MAX}mm</span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[var(--color-error-600)]" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-help`} className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Smaller values = higher quality, longer print time
        </p>
      )}
    </div>
  )
}
