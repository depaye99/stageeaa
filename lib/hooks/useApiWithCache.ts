import { useState, useEffect, useCallback } from 'react'
import { cacheService } from '@/lib/services/cache-service'

interface UseApiWithCacheOptions {
  cacheKey: string
  cacheTTL?: number
  dependencies?: any[]
}

export function useApiWithCache<T>(
  fetchFunction: () => Promise<T>,
  options: UseApiWithCacheOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await cacheService.getCached(
        options.cacheKey,
        fetchFunction,
        options.cacheTTL || 5
      )
      setData(result)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, options.cacheKey, options.cacheTTL])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...(options.dependencies || [])])

  const refetch = useCallback(() => {
    cacheService.delete(options.cacheKey)
    fetchData()
  }, [fetchData, options.cacheKey])

  return { data, loading, error, refetch }
}