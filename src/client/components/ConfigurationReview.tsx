/**
 * Configuration Review Component
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Displays configuration summary showing all non-default parameter values
 * grouped by category before slicing execution starts.
 */

import { DEFAULT_PARAMETERS } from '../utils/validation';
import type { ConfigurationFormData } from './ConfigurationForm';

interface ConfigurationReviewProps {
  configuration: ConfigurationFormData;
  configName: string;
  onEdit: () => void;
  onConfirm: () => void;
}

interface ParameterChange {
  name: string;
  value: any;
  default: any;
  unit?: string;
}

export function ConfigurationReview({
  configuration,
  configName,
  onEdit,
  onConfirm
}: ConfigurationReviewProps) {
  // Identify non-default parameters
  const getNonDefaultParameters = (): Record<string, ParameterChange[]> => {
    const changes: Record<string, ParameterChange[]> = {
      Quality: [],
      Infill: [],
      Support: [],
      Speed: [],
      Temperature: []
    };

    // Quality Settings
    if (configuration.layerHeight !== DEFAULT_PARAMETERS.layerHeight) {
      changes.Quality.push({
        name: 'Layer Height',
        value: configuration.layerHeight,
        default: DEFAULT_PARAMETERS.layerHeight,
        unit: 'mm'
      });
    }
    if (configuration.initialLayerHeight !== DEFAULT_PARAMETERS.initialLayerHeight) {
      changes.Quality.push({
        name: 'Initial Layer Height',
        value: configuration.initialLayerHeight,
        default: DEFAULT_PARAMETERS.initialLayerHeight,
        unit: 'mm'
      });
    }
    if (configuration.wallLoops !== DEFAULT_PARAMETERS.wallLoops) {
      changes.Quality.push({
        name: 'Wall Loops',
        value: configuration.wallLoops,
        default: DEFAULT_PARAMETERS.wallLoops
      });
    }
    if (configuration.topShellLayers !== DEFAULT_PARAMETERS.topShellLayers) {
      changes.Quality.push({
        name: 'Top Shell Layers',
        value: configuration.topShellLayers,
        default: DEFAULT_PARAMETERS.topShellLayers
      });
    }
    if (configuration.bottomShellLayers !== DEFAULT_PARAMETERS.bottomShellLayers) {
      changes.Quality.push({
        name: 'Bottom Shell Layers',
        value: configuration.bottomShellLayers,
        default: DEFAULT_PARAMETERS.bottomShellLayers
      });
    }

    // Infill Settings
    if (configuration.infillDensity !== DEFAULT_PARAMETERS.infillDensity) {
      changes.Infill.push({
        name: 'Infill Density',
        value: configuration.infillDensity,
        default: DEFAULT_PARAMETERS.infillDensity,
        unit: '%'
      });
    }
    if (configuration.infillPattern !== DEFAULT_PARAMETERS.infillPattern) {
      changes.Infill.push({
        name: 'Infill Pattern',
        value: configuration.infillPattern,
        default: DEFAULT_PARAMETERS.infillPattern
      });
    }

    // Support Settings
    if (configuration.enableSupport !== DEFAULT_PARAMETERS.enableSupport) {
      changes.Support.push({
        name: 'Enable Support',
        value: configuration.enableSupport ? 'Yes' : 'No',
        default: DEFAULT_PARAMETERS.enableSupport ? 'Yes' : 'No'
      });
    }
    if (configuration.supportType !== DEFAULT_PARAMETERS.supportType) {
      changes.Support.push({
        name: 'Support Type',
        value: configuration.supportType,
        default: DEFAULT_PARAMETERS.supportType
      });
    }
    if (configuration.supportThresholdAngle !== DEFAULT_PARAMETERS.supportThresholdAngle) {
      changes.Support.push({
        name: 'Support Threshold Angle',
        value: configuration.supportThresholdAngle,
        default: DEFAULT_PARAMETERS.supportThresholdAngle,
        unit: '°'
      });
    }

    // Speed Settings
    if (configuration.outerWallSpeed !== DEFAULT_PARAMETERS.outerWallSpeed) {
      changes.Speed.push({
        name: 'Outer Wall Speed',
        value: configuration.outerWallSpeed,
        default: DEFAULT_PARAMETERS.outerWallSpeed,
        unit: 'mm/s'
      });
    }
    if (configuration.innerWallSpeed !== DEFAULT_PARAMETERS.innerWallSpeed) {
      changes.Speed.push({
        name: 'Inner Wall Speed',
        value: configuration.innerWallSpeed,
        default: DEFAULT_PARAMETERS.innerWallSpeed,
        unit: 'mm/s'
      });
    }
    if (configuration.sparseInfillSpeed !== DEFAULT_PARAMETERS.sparseInfillSpeed) {
      changes.Speed.push({
        name: 'Infill Speed',
        value: configuration.sparseInfillSpeed,
        default: DEFAULT_PARAMETERS.sparseInfillSpeed,
        unit: 'mm/s'
      });
    }
    if (configuration.initialLayerSpeed !== DEFAULT_PARAMETERS.initialLayerSpeed) {
      changes.Speed.push({
        name: 'Initial Layer Speed',
        value: configuration.initialLayerSpeed,
        default: DEFAULT_PARAMETERS.initialLayerSpeed,
        unit: 'mm/s'
      });
    }

    // Temperature
    if (configuration.nozzleTemperature !== DEFAULT_PARAMETERS.nozzleTemperature) {
      changes.Temperature.push({
        name: 'Nozzle Temperature',
        value: configuration.nozzleTemperature,
        default: DEFAULT_PARAMETERS.nozzleTemperature,
        unit: '°C'
      });
    }

    // Remove empty categories
    Object.keys(changes).forEach(key => {
      if (changes[key].length === 0) {
        delete changes[key];
      }
    });

    return changes;
  };

  const nonDefaultParams = getNonDefaultParameters();
  const hasChanges = Object.keys(nonDefaultParams).length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[var(--color-background-primary)] border border-[var(--color-neutral-300)] rounded-lg shadow-sm">
        {/* Header */}
        <div className="bg-[var(--color-primary-50)] px-6 py-4 border-b border-[var(--color-primary-100)]">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Configuration Review</h2>
          <p className="text-[var(--color-text-secondary)] mt-1">Configuration: <span className="font-semibold">{configName}</span></p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {hasChanges ? (
            <>
              <p className="text-[var(--color-text-primary)] mb-6">
                The following parameters differ from default values:
              </p>

              {Object.entries(nonDefaultParams).map(([category, params]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 border-b border-[var(--color-neutral-300)] pb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {params.map((param, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-4 bg-[var(--color-background-secondary)] rounded-md"
                      >
                        <span className="text-[var(--color-text-primary)] font-medium">{param.name}</span>
                        <div className="text-right">
                          <span className="text-[var(--color-primary-600)] font-semibold">
                            {param.value}{param.unit}
                          </span>
                          <span className="text-[var(--color-text-tertiary)] text-sm ml-2">
                            (default: {param.default}{param.unit})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--color-text-secondary)] text-lg">
                All parameters are set to default values
              </p>
              <p className="text-[var(--color-text-tertiary)] text-sm mt-2">
                Standard quality: 0.2mm layer height, 20% infill, no supports
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-8 p-4 bg-[var(--color-background-secondary)] rounded-md border border-[var(--color-neutral-300)]">
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[var(--color-text-tertiary)]">Layer Height</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{configuration.layerHeight}mm</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)]">Infill</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{configuration.infillDensity}%</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)]">Supports</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{configuration.enableSupport ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-tertiary)]">Temperature</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{configuration.nozzleTemperature}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[var(--color-background-secondary)] border-t border-[var(--color-neutral-300)] flex justify-end space-x-4">
          <button
            onClick={onEdit}
            className="px-6 py-2 border border-[var(--color-neutral-400)] rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-background-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-500)]"
          >
            Edit Configuration
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[var(--color-primary-600)] text-white rounded-md hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
          >
            Confirm & Start Slicing
          </button>
        </div>
      </div>
    </div>
  );
}
