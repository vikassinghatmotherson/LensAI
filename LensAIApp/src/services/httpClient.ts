import { authService } from './authService'

export interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

/**
 * HTTP Client with automatic bearer token injection
 * Wraps the native fetch API and adds Authorization header with bearer token
 */
export const httpClient = {
  /**
   * Make HTTP request with automatic bearer token attachment
   */
  async request(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const { skipAuth = false, headers = {}, ...restOptions } = options

    const requestHeaders: Record<string, string> = {}

    // Convert HeadersInit to Record<string, string>
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        requestHeaders[key] = value
      })
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        requestHeaders[key] = value
      })
    } else if (typeof headers === 'object') {
      Object.assign(requestHeaders, headers)
    }

    // Add bearer token if not skipped and token exists
    if (!skipAuth) {
      const token = authService.getAccessToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    // Add Content-Type if not already set and method is POST/PUT/PATCH
    if (
      !requestHeaders['Content-Type'] &&
      ['POST', 'PUT', 'PATCH'].includes(restOptions.method?.toUpperCase() || '')
    ) {
      if (!(restOptions.body instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json'
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    })

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && !skipAuth) {
      console.warn('Unauthorized request - token may be expired')
      // Optionally trigger re-authentication here
      // await authService.logout()
    }

    return response
  },

  /**
   * GET request
   */
  async get<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await this.request(url, { ...options, method: 'GET' })
    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * POST request
   */
  async post<T>(
    url: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await this.request(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await this.request(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const response = await this.request(url, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      throw new Error(`PATCH ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await this.request(url, { ...options, method: 'DELETE' })
    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },
}
