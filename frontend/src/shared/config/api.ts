// Basis API Konfiguration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30000,
} as const

// Generischer Fetch Wrapper
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${apiConfig.baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    signal: AbortSignal.timeout(apiConfig.timeout),
  })

  if (!response.ok) {
    const error = new Error(`API Error: ${response.statusText}`)
    ;(error as any).status = response.status
    throw error
  }

  return response
}
