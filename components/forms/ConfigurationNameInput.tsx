'use client'

interface ConfigurationNameInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  id?: string
  label?: string
  required?: boolean
}

export function ConfigurationNameInput({
  value,
  onChange,
  error,
  id = 'config-name',
  label = 'Configuration Name',
  required = true
}: ConfigurationNameInputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-error-500)] ml-1" aria-label="required">*</span>}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-[var(--color-text-primary)] bg-[var(--color-background-primary)] ${
          error
            ? 'border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]'
            : 'border-[var(--color-neutral-400)] focus:ring-[var(--color-primary-500)]'
        }`}
        placeholder="e.g., Fast Print, High Quality"
        maxLength={100}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[var(--color-error-600)]" role="alert">
          {error}
        </p>
      )}
      <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
        {value.length}/100 characters
      </p>
    </div>
  )
}
