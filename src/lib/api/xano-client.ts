import { config, validateXanoConfig } from '@/lib/config'
import type { APIError } from '@/lib/types'

export class XanoAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message)
    this.name = 'XanoAPIError'
  }
}

export class XanoClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    validateXanoConfig()
    this.baseUrl = config.xano.baseUrl
    this.apiKey = config.xano.apiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    // Only add authorization header if API key is provided
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      let errorCode = 'HTTP_ERROR'
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.code || errorCode
      } catch {
        // If parsing error response fails, use default message
      }
      
      throw new XanoAPIError(errorMessage, response.status, errorCode)
    }

    return response.json()
  }

  // Generic CRUD operations
  async getAll<T>(table: string): Promise<T[]> {
    return this.request<T[]>(`/${table}`)
  }

  async getById<T>(table: string, id: string): Promise<T> {
    return this.request<T>(`/${table}/${id}`)
  }

  async create<T>(table: string, data: Omit<T, 'id' | 'created_at'>): Promise<T> {
    return this.request<T>(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${table}/${id}`, {
      method: 'PATCH', // Xano uses PATCH instead of PUT
      body: JSON.stringify(data),
    })
  }

  async delete(table: string, id: string): Promise<boolean> {
    try {
      await this.request(`/${table}/${id}`, {
        method: 'DELETE',
      })
      return true // If no error thrown, delete was successful
    } catch (error) {
      if (error instanceof XanoAPIError && error.status === 404) {
        return false // Item not found
      }
      throw error // Re-throw other errors
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      await this.request('/category')
      return { status: 'connected' }
    } catch (error) {
      if (error instanceof XanoAPIError) {
        throw error
      }
      throw new XanoAPIError('Connection failed', 0, 'CONNECTION_ERROR')
    }
  }
}