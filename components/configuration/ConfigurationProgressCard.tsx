'use client'

import type { Configuration } from '@/types/database'
import type { ConfigurationParameters } from '@/types/database'

interface ConfigurationProgressCardProps {
  configuration: Configuration
  status: 'queued' | 'slicing' | 'complete' | 'failed'
  errorMessage?: string
}

export function ConfigurationProgressCard({
  configuration,
  status,
  errorMessage
}: ConfigurationProgressCardProps) {
  // Parse parameters from JSONB
  const params = configuration.parameters as unknown as ConfigurationParameters

  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (status) {
      case 'queued':
        return 0
      case 'slicing':
        return 50 // Indeterminate, show 50%
      case 'complete':
        return 100
      case 'failed':
        return 100
      default:
        return 0
    }
  }

  const progress = getProgressPercentage()

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'queued':
        return 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
      case 'slicing':
        return 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
      case 'complete':
        return 'bg-[var(--color-success-100)] text-[var(--color-success-800)]'
      case 'failed':
        return 'bg-[var(--color-error-100)] text-[var(--color-error-800)]'
      default:
        return 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
    }
  }

  // Get progress bar color
  const getProgressBarColor = () => {
    switch (status) {
      case 'queued':
        return 'bg-[var(--color-neutral-400)]'
      case 'slicing':
        return 'bg-[var(--color-info-600)]'
      case 'complete':
        return 'bg-[var(--color-success-600)]'
      case 'failed':
        return 'bg-[var(--color-error-600)]'
      default:
        return 'bg-[var(--color-neutral-400)]'
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'slicing':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      case 'complete':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-default)] rounded-lg p-6 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {configuration.config_name}
            </h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              {status === 'queued' && 'Queued'}
              {status === 'slicing' && 'Slicing...'}
              {status === 'complete' && 'Complete'}
              {status === 'failed' && 'Failed'}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            {params.layer_height}mm · {params.infill_density}% · {params.support_type} · {params.printer_model.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-2 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out ${
              status === 'slicing' ? 'animate-pulse' : ''
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {status === 'failed' && errorMessage && (
        <div className="mt-3 p-3 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-lg">
          <p className="text-sm text-[var(--color-error-700)]">{errorMessage}</p>
        </div>
      )}

      {/* Status Text */}
      <p className="text-sm text-[var(--color-text-secondary)]">
        {status === 'queued' && 'Waiting to start...'}
        {status === 'slicing' && 'Processing G-code...'}
        {status === 'complete' && 'Successfully sliced'}
        {status === 'failed' && 'Slicing failed'}
      </p>
    </div>
  )
}
