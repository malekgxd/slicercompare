'use client'

import { useState } from 'react'
import type { Configuration } from '@/types/database'
import type { ConfigurationParameters } from '@/types/database'

interface ConfigurationCardProps {
  configuration: Configuration
  onEdit: (configuration: Configuration) => void
  onDelete: (configId: string) => void
  onDuplicate: (configuration: Configuration) => void
}

export function ConfigurationCard({
  configuration,
  onEdit,
  onDelete,
  onDuplicate
}: ConfigurationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Parse parameters from JSONB
  const params = configuration.parameters as unknown as ConfigurationParameters

  return (
    <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-default)] rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {configuration.config_name}
            </h3>
            {configuration.is_active && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-success-100)] text-[var(--color-success-800)]">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Created {new Date(configuration.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(configuration)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors"
            aria-label="Edit configuration"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDuplicate(configuration)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-success-600)] hover:bg-[var(--color-success-50)] rounded-lg transition-colors"
            aria-label="Duplicate configuration"
            title="Duplicate"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(configuration.config_id)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error-600)] hover:bg-[var(--color-error-50)] rounded-lg transition-colors"
            aria-label="Delete configuration"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Key Parameters Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-tertiary)]">Layer Height</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{params.layer_height}mm</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-tertiary)]">Infill</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{params.infill_density}%</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-tertiary)]">Supports</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">{params.support_type}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-tertiary)]">Printer</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{params.printer_model.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Expand/Collapse for all parameters */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium flex items-center gap-1"
      >
        {isExpanded ? 'Show less' : 'Show all parameters'}
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border-default)] grid grid-cols-2 gap-3 text-sm">
          {params.print_speed && (
            <div>
              <p className="text-[var(--color-text-tertiary)]">Print Speed</p>
              <p className="font-medium text-[var(--color-text-primary)]">{params.print_speed} mm/s</p>
            </div>
          )}
          {params.nozzle_temperature && (
            <div>
              <p className="text-[var(--color-text-tertiary)]">Nozzle Temp</p>
              <p className="font-medium text-[var(--color-text-primary)]">{params.nozzle_temperature}°C</p>
            </div>
          )}
          {params.bed_temperature && (
            <div>
              <p className="text-[var(--color-text-tertiary)]">Bed Temp</p>
              <p className="font-medium text-[var(--color-text-primary)]">{params.bed_temperature}°C</p>
            </div>
          )}
          {params.wall_thickness && (
            <div>
              <p className="text-[var(--color-text-tertiary)]">Wall Thickness</p>
              <p className="font-medium text-[var(--color-text-primary)]">{params.wall_thickness}mm</p>
            </div>
          )}
          {params.top_bottom_thickness && (
            <div>
              <p className="text-[var(--color-text-tertiary)]">Top/Bottom Thickness</p>
              <p className="font-medium text-[var(--color-text-primary)]">{params.top_bottom_thickness}mm</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
