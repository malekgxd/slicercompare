import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import type { ComparisonSession, Configuration } from '@/types/database'
import { ConfigurationCard } from '@/components/configuration/ConfigurationCard'
import { ConfigurationProgressCard } from '@/components/configuration/ConfigurationProgressCard'
import { ConfigurationFormModal, type ConfigurationFormData } from '@/components/configuration/ConfigurationFormModal'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ComparisonTable } from '@/src/components/comparison/ComparisonTable'
import { useComparisonResults } from '@/hooks/useComparisonResults'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default function SessionDetailPage() {
  const navigate = useNavigate()
  const { id: sessionId } = useParams<{ id: string }>()

  // Data state
  const [session, setSession] = useState<ComparisonSession | null>(null)
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'duplicate'>('create')
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null)

  // Confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingConfigId, setDeletingConfigId] = useState<string | null>(null)

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null)

  // Running comparison state
  const [isRunningComparison, setIsRunningComparison] = useState(false)

  // Poll for slicing progress when session is processing
  const {
    results: slicingResults,
    isPolling
  } = useComparisonResults({
    sessionId: sessionId || '',
    enabled: session?.status === 'processing',
    onAllComplete: () => {
      // Refresh session data when slicing completes
      if (sessionId) {
        supabase
          .from('comparison_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()
          .then(({ data }) => {
            if (data) setSession(data)
          })
      }
    }
  })

  // Fetch session and configurations
  useEffect(() => {
    if (!sessionId) return

    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase
          .from('comparison_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()

        if (sessionError) throw sessionError
        if (!sessionData) throw new Error('Session not found')

        setSession(sessionData)

        // Fetch configurations for this session
        const { data: configsData, error: configsError } = await supabase
          .from('configurations')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })

        if (configsError) throw configsError

        setConfigurations(configsData || [])
      } catch (err) {
        console.error('Failed to fetch session data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load session')
        showToast('Failed to load session data', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sessionId])

  // Toast helper
  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type })
  }

  // Modal handlers
  const handleAddConfiguration = () => {
    // Check max configurations limit (3)
    if (configurations.length >= 3) {
      showToast('Maximum 3 configurations per session', 'warning')
      return
    }

    setFormMode('create')
    setEditingConfig(null)
    setIsFormModalOpen(true)
  }

  const handleEditConfiguration = (config: Configuration) => {
    setFormMode('edit')
    setEditingConfig(config)
    setIsFormModalOpen(true)
  }

  const handleDuplicateConfiguration = (config: Configuration) => {
    // Check max configurations limit (3)
    if (configurations.length >= 3) {
      showToast('Maximum 3 configurations per session', 'warning')
      return
    }

    setFormMode('duplicate')
    setEditingConfig(config)
    setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingConfig(null)
  }

  // CRUD operations
  const handleSaveConfiguration = async (formData: ConfigurationFormData) => {
    if (!sessionId) return

    try {
      if (formMode === 'create' || formMode === 'duplicate') {
        // Create new configuration
        const { data, error } = await supabase
          .from('configurations')
          .insert({
            session_id: sessionId,
            config_name: formData.config_name,
            parameters: formData.parameters,
            is_active: true
          })
          .select()
          .single()

        if (error) throw error

        setConfigurations(prev => [data, ...prev])
        showToast(`Configuration "${formData.config_name}" created successfully`, 'success')
      } else if (formMode === 'edit' && editingConfig) {
        // Update existing configuration
        const { data, error } = await supabase
          .from('configurations')
          .update({
            config_name: formData.config_name,
            parameters: formData.parameters,
            updated_at: new Date().toISOString()
          })
          .eq('config_id', editingConfig.config_id)
          .select()
          .single()

        if (error) throw error

        setConfigurations(prev =>
          prev.map(c => c.config_id === data.config_id ? data : c)
        )
        showToast(`Configuration "${formData.config_name}" updated successfully`, 'success')
      }
    } catch (err) {
      console.error('Failed to save configuration:', err)
      showToast('Failed to save configuration', 'error')
      throw err // Re-throw to let modal handle it
    }
  }

  const handleDeleteClick = (configId: string) => {
    setDeletingConfigId(configId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingConfigId) return

    try {
      const { error } = await supabase
        .from('configurations')
        .delete()
        .eq('config_id', deletingConfigId)

      if (error) throw error

      const deletedConfig = configurations.find(c => c.config_id === deletingConfigId)
      setConfigurations(prev => prev.filter(c => c.config_id !== deletingConfigId))
      showToast(`Configuration "${deletedConfig?.config_name}" deleted successfully`, 'success')
    } catch (err) {
      console.error('Failed to delete configuration:', err)
      showToast('Failed to delete configuration', 'error')
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingConfigId(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setDeletingConfigId(null)
  }

  // Run comparison
  const handleRunComparison = async () => {
    if (!sessionId) return
    if (configurations.length < 2) {
      showToast('At least 2 configurations required to run comparison', 'warning')
      return
    }

    setIsRunningComparison(true)
    try {
      // Call batch slicing API
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/slice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to start slicing')
      }

      // Refresh session to get updated status
      const { data: updatedSession, error: sessionError } = await supabase
        .from('comparison_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (!sessionError && updatedSession) {
        setSession(updatedSession)
      }

      showToast('Comparison started successfully', 'success')
    } catch (err: any) {
      console.error('Failed to start comparison:', err)
      showToast(err.message || 'Failed to start comparison', 'error')
    } finally {
      setIsRunningComparison(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !session) {
    return (
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg p-6 border border-red-500" style={{ backgroundColor: '#2a3142' }}>
            <h2 className="text-lg font-semibold text-white mb-2">Error Loading Session</h2>
            <p className="text-red-300 mb-4">{error || 'Session not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const canRunComparison = configurations.length >= 2 && !isRunningComparison
  const canAddConfiguration = configurations.length < 3

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Session Header - SwapSpool style */}
        <div className="rounded-lg p-6 mb-6 shadow-sm" style={{ backgroundColor: '#2a3142' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {session.session_name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{session.session_name || 'No file'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{configurations.length} configuration{configurations.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.status === 'draft' ? 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]' :
                    session.status === 'processing' ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]' :
                    session.status === 'completed' ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]' :
                    'bg-[var(--color-error-100)] text-[var(--color-error-800)]'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Created {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Back to sessions"
              title="Back to sessions"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddConfiguration}
              disabled={!canAddConfiguration}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              aria-label="Add configuration"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Configuration
            </button>

            <button
              onClick={handleRunComparison}
              disabled={!canRunComparison}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              aria-label="Run comparison"
            >
              {isRunningComparison ? (
                <>
                  <LoadingSpinner size="sm" />
                  Starting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Comparison
                </>
              )}
            </button>
          </div>

          {/* Help text */}
          {configurations.length < 2 && (
            <p className="mt-3 text-sm text-gray-300">
              Add at least 2 configurations to run a comparison
            </p>
          )}
        </div>

        {/* Configurations List */}
        {configurations.length === 0 ? (
          <EmptyState
            message="No configurations yet. Add your first configuration to get started."
            actionLabel="Add Configuration"
            onAction={handleAddConfiguration}
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        ) : session.status === 'processing' ? (
          // Show progress cards during slicing
          <div className="space-y-4">
            {isPolling && (
              <div className="bg-[var(--color-info-50)] border border-[var(--color-info-200)] rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <LoadingSpinner size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-info-900)]">
                      Slicing in Progress
                    </p>
                    <p className="text-sm text-[var(--color-info-700)]">
                      Processing {configurations.length} configuration{configurations.length !== 1 ? 's' : ''}...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {configurations.map(config => {
                // Find matching slicing result for this configuration
                const result = slicingResults.find(r => r.configurationId === config.config_id)
                const status = result?.status || 'queued'

                return (
                  <div key={config.config_id} className="flex-shrink-0 w-80">
                    <ConfigurationProgressCard
                      configuration={config}
                      status={status}
                      errorMessage={result?.errorMessage}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Show normal cards when not processing - horizontal layout
          <div className="flex gap-6 overflow-x-auto pb-4">
            {configurations.map(config => (
              <div key={config.config_id} className="flex-shrink-0 w-96">
                <ConfigurationCard
                  configuration={config}
                  onEdit={handleEditConfiguration}
                  onDelete={handleDeleteClick}
                  onDuplicate={handleDuplicateConfiguration}
                />
              </div>
            ))}
          </div>
        )}

        {/* Comparison Results - SwapSpool style */}
        {(session.status === 'processing' || session.status === 'completed') && configurations.length > 0 && sessionId && (
          <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#2a3142' }}>
            <div className="px-3 md:px-4 py-4 rounded-t-lg border-b-2 border-purple-500/30 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-purple-300">Comparison Results</h2>
            </div>
            <ComparisonTable sessionId={sessionId} />
          </div>
        )}
      </div>

      {/* Configuration Form Modal */}
      <ConfigurationFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveConfiguration}
        initialValues={editingConfig ? {
          config_name: formMode === 'duplicate' ? `${editingConfig.config_name} (Copy)` : editingConfig.config_name,
          parameters: editingConfig.parameters as any
        } : undefined}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Configuration"
        message={`Are you sure you want to delete "${configurations.find(c => c.config_id === deletingConfigId)?.config_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Notification */}
      {toast && (
        <ErrorToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
