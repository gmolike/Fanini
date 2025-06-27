// API Konfiguration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const

// API Client Factory
export function createApiClient(endpoint: string) {
  return {
    get: async <T>(path: string): Promise<T> => {
      const response = await fetch(`${apiConfig.baseUrl}${endpoint}${path}`, {
        headers: apiConfig.headers,
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response.json()
    },
    post: async <T, D = unknown>(path: string, data: D): Promise<T> => {
      const response = await fetch(`${apiConfig.baseUrl}${endpoint}${path}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response.json()
    },
    // weitere Methoden...
  }
}
