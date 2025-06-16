"use client"

import { useState, useEffect, useCallback } from 'react'

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { immediate = true, onSuccess, onError } = options

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await apiCall()
      setData(result)

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(error)

      if (onError) {
        onError(error)
      }

      throw error
    } finally {
      setLoading(false)
    }
  }, [apiCall, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
    refetch: execute
  }
}

export function useMutation<T, P>(apiCall: (params: P) => Promise<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addNotification } = useAppStore()

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall(params)

      addNotification({
        id: Date.now().toString(),
        type: "success",
        title: "Succès",
        message: "Opération réalisée avec succès",
        timestamp: new Date(),
        read: false,
      })

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      addNotification({
        id: Date.now().toString(),
        type: "error",
        title: "Erreur",
        message: errorMessage,
        timestamp: new Date(),
        read: false,
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}