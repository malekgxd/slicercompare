/**
 * Configuration Form Component
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Comprehensive parameter configuration UI with all Tier 1 parameters organized into
 * collapsible categories: Quality, Infill, Support, Speed, Temperature.
 */

import { useState, useEffect } from 'react';
import { VALIDATION_RULES, DEFAULT_PARAMETERS, validateAllParameters, allValid, getErrors } from '../utils/validation';

export interface ConfigurationFormData {
  // Quality Settings
  layerHeight: number;
  initialLayerHeight: number;
  wallLoops: number;
  topShellLayers: number;
  bottomShellLayers: number;

  // Infill Settings
  infillDensity: number;
  infillPattern: string;

  // Support Settings
  enableSupport: boolean;
  supportType: 'normal' | 'tree';
  supportThresholdAngle: number;

  // Speed Settings
  outerWallSpeed: number;
  innerWallSpeed: number;
  sparseInfillSpeed: number;
  initialLayerSpeed: number;

  // Temperature
  nozzleTemperature: number;
}

interface ConfigurationFormProps {
  onSubmit: (data: ConfigurationFormData) => void;
  initialData?: Partial<ConfigurationFormData>;
}

export function ConfigurationForm({ onSubmit, initialData }: ConfigurationFormProps) {
  // Form state with defaults
  const [formData, setFormData] = useState<ConfigurationFormData>({
    ...DEFAULT_PARAMETERS,
    ...initialData
  });

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    quality: true,
    infill: false,
    support: false,
    speed: false,
    temperature: false
  });

  // Validation state
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Auto-adjust initial layer height when layer height changes
  useEffect(() => {
    if (formData.initialLayerHeight === formData.layerHeight) {
      // Suggest 120% of layer height
      setFormData(prev => ({
        ...prev,
        initialLayerHeight: Math.round(prev.layerHeight * 1.2 * 100) / 100
      }));
    }
  }, [formData.layerHeight]);

  // Validate on form data change
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const results = validateAllParameters(formData);
      setValidationResults(results);
    }
  }, [formData, hasAttemptedSubmit]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: keyof ConfigurationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const results = validateAllParameters(formData);
    setValidationResults(results);

    if (allValid(results)) {
      onSubmit(formData);
    }
  };

  const renderNumberInput = (
    field: keyof ConfigurationFormData,
    label: string,
    rule: any,
    disabled = false
  ) => {
    const value = formData[field] as number;
    const error = validationResults[field]?.error;
    const hasError = hasAttemptedSubmit && !validationResults[field]?.valid;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          {label}
          {rule.unit && <span className="text-[var(--color-text-tertiary)] ml-1">({rule.unit})</span>}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
          min={rule.min}
          max={rule.max}
          step={rule.step || 1}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)] ${
            hasError ? 'border-[var(--color-error-500)]' : 'border-[var(--color-neutral-400)]'
          } ${disabled ? 'bg-[var(--color-background-tertiary)] cursor-not-allowed' : ''}`}
        />
        {hasError && error && (
          <p className="text-[var(--color-error-600)] text-sm mt-1">{error}</p>
        )}
        {rule.default !== undefined && (
          <p className="text-[var(--color-text-tertiary)] text-xs mt-1">Default: {rule.default}{rule.unit}</p>
        )}
      </div>
    );
  };

  const renderSection = (
    title: string,
    sectionKey: keyof typeof expandedSections,
    content: React.ReactNode
  ) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border border-[var(--color-neutral-300)] rounded-lg mb-4">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-4 py-3 flex justify-between items-center bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] rounded-t-lg"
        >
          <span className="font-semibold text-[var(--color-text-primary)]">{title}</span>
          <svg
            className={`w-5 h-5 transition-transform text-[var(--color-text-primary)] ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="p-4 bg-[var(--color-background-primary)]">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">Slicer Configuration</h2>

      {hasAttemptedSubmit && !allValid(validationResults) && (
        <div className="mb-6 p-4 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-md">
          <h3 className="font-semibold text-[var(--color-error-800)] mb-2">Validation Errors:</h3>
          <ul className="list-disc list-inside text-[var(--color-error-700)] text-sm">
            {getErrors(validationResults).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* QUALITY SETTINGS */}
      {renderSection('Quality Settings', 'quality', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('layerHeight', 'Layer Height', VALIDATION_RULES.layerHeight)}
          {renderNumberInput('initialLayerHeight', 'Initial Layer Height', VALIDATION_RULES.initialLayerHeight)}
          {renderNumberInput('wallLoops', 'Wall Loops', VALIDATION_RULES.wallLoops)}
          {renderNumberInput('topShellLayers', 'Top Shell Layers', VALIDATION_RULES.topShellLayers)}
          {renderNumberInput('bottomShellLayers', 'Bottom Shell Layers', VALIDATION_RULES.bottomShellLayers)}
        </div>
      ))}

      {/* INFILL SETTINGS */}
      {renderSection('Infill Settings', 'infill', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('infillDensity', 'Infill Density', VALIDATION_RULES.infillDensity)}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Infill Pattern
            </label>
            <select
              value={formData.infillPattern}
              onChange={(e) => handleInputChange('infillPattern', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)]"
            >
              <option value="grid">Grid</option>
              <option value="gyroid">Gyroid</option>
              <option value="honeycomb">Honeycomb</option>
              <option value="triangle">Triangle</option>
              <option value="cubic">Cubic</option>
              <option value="line">Line</option>
              <option value="concentric">Concentric</option>
              <option value="3dhoneycomb">3D Honeycomb</option>
              <option value="hilbertcurve">Hilbert Curve</option>
              <option value="archimedeanchords">Archimedes Chords</option>
              <option value="octagramspiral">Octagram Spiral</option>
            </select>
            <p className="text-[var(--color-text-tertiary)] text-xs mt-1">Default: grid</p>
          </div>
          {formData.infillDensity === 0 && (
            <div className="col-span-2 p-3 bg-[var(--color-info-50)] border border-[var(--color-info-200)] rounded-md">
              <p className="text-[var(--color-info-800)] text-sm">
                ℹ️ Infill pattern is not used when infill density is 0% (vase mode or sparse models)
              </p>
            </div>
          )}
        </div>
      ))}

      {/* SUPPORT SETTINGS */}
      {renderSection('Support Settings', 'support', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4 col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.enableSupport}
                onChange={(e) => handleInputChange('enableSupport', e.target.checked)}
                className="w-4 h-4 text-[var(--color-primary-600)] border-[var(--color-neutral-400)] rounded focus:ring-[var(--color-primary-500)]"
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Enable Support Structures</span>
            </label>
            <p className="text-[var(--color-text-tertiary)] text-xs mt-1 ml-6">Default: disabled</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Support Type
            </label>
            <select
              value={formData.supportType}
              onChange={(e) => handleInputChange('supportType', e.target.value as 'normal' | 'tree')}
              disabled={!formData.enableSupport}
              className={`w-full px-3 py-2 border border-[var(--color-neutral-400)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-[var(--color-text-primary)] bg-[var(--color-background-primary)] ${
                !formData.enableSupport ? 'bg-[var(--color-background-tertiary)] cursor-not-allowed' : ''
              }`}
            >
              <option value="normal">Normal</option>
              <option value="tree">Tree (less material, easier removal)</option>
            </select>
            <p className="text-[var(--color-text-tertiary)] text-xs mt-1">Default: normal</p>
          </div>

          {renderNumberInput(
            'supportThresholdAngle',
            'Support Threshold Angle',
            VALIDATION_RULES.supportThresholdAngle,
            !formData.enableSupport
          )}

          {!formData.enableSupport && (
            <div className="col-span-2 p-3 bg-[var(--color-background-secondary)] border border-[var(--color-neutral-300)] rounded-md">
              <p className="text-[var(--color-text-secondary)] text-sm">
                Support settings only apply when supports are enabled
              </p>
            </div>
          )}
        </div>
      ))}

      {/* SPEED SETTINGS */}
      {renderSection('Speed Settings', 'speed', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('outerWallSpeed', 'Outer Wall Speed', VALIDATION_RULES.outerWallSpeed)}
          {renderNumberInput('innerWallSpeed', 'Inner Wall Speed', VALIDATION_RULES.innerWallSpeed)}
          {renderNumberInput('sparseInfillSpeed', 'Infill Speed', VALIDATION_RULES.sparseInfillSpeed)}
          {renderNumberInput('initialLayerSpeed', 'Initial Layer Speed', VALIDATION_RULES.initialLayerSpeed)}
        </div>
      ))}

      {/* TEMPERATURE SETTINGS */}
      {renderSection('Temperature', 'temperature', (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNumberInput('nozzleTemperature', 'Nozzle Temperature', VALIDATION_RULES.nozzleTemperature)}
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setFormData({ ...DEFAULT_PARAMETERS })}
          className="px-6 py-2 border border-[var(--color-neutral-400)] rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-500)]"
        >
          Reset to Defaults
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--color-primary-600)] text-white rounded-md hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          Create Configuration
        </button>
      </div>
    </form>
  );
}
