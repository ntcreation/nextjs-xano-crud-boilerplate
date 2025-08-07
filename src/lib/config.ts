export const config = {
  // Data source mode: 'demo' or 'xano'
  dataMode: (process.env.DATA_MODE as 'demo' | 'xano') || 'demo',
  
  // Xano configuration
  xano: {
    baseUrl: process.env.XANO_BASE_URL || '',
    apiKey: process.env.XANO_API_KEY || '',
    swaggerUrl: process.env.XANO_SWAGGER_URL || '',
  },
  
  // App configuration
  app: {
    name: 'CRUD Admin',
    version: '1.0.0',
  }
} as const

// Validate Xano config when in Xano mode
export function validateXanoConfig() {
  if (config.dataMode === 'xano') {
    const missing = []
    if (!config.xano.baseUrl) missing.push('XANO_BASE_URL')
    // API key is optional for open endpoints
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required Xano environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all Xano credentials are set.'
      )
    }
  }
}