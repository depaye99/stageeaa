
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock fetch pour les tests
global.fetch = jest.fn()

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle successful API calls', async () => {
    const mockData = { id: '1', name: 'Test User' }
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const response = await fetch('/api/test')
    const data = await response.json()

    expect(data).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('/api/test')
  })

  it('should handle API errors gracefully', async () => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)

    const response = await fetch('/api/test')
    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
  })
})
