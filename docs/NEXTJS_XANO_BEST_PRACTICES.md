# Next.js + Xano Development Best Practices

Comprehensive guide with proven patterns, architectural decisions, and lessons learned from building production-ready Next.js applications with Xano backend integration.

## Table of Contents

1. [Critical Architecture Patterns](#critical-architecture-patterns)
2. [Development Workflow](#development-workflow)
3. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
4. [Data Layer Design](#data-layer-design)
5. [Error Handling Strategies](#error-handling-strategies)
6. [Production Deployment](#production-deployment)

## Critical Architecture Patterns

### 1. API Route Middleware Layer

**Rule: ALWAYS use Next.js API routes as middleware between frontend and Xano**

```typescript
// ✅ CORRECT PATTERN
// /app/api/posts/route.ts
export async function GET() {
  const response = await fetch(`${process.env.XANO_BASE_URL}/posts`, {
    headers: { 'Authorization': `Bearer ${process.env.XANO_API_KEY}` }
  })
  return Response.json(await response.json())
}

// Frontend component
async function PostList() {
  const posts = await fetch('/api/posts') // Uses API route
  return <div>{/* render posts */}</div>
}
```

**Why This Pattern Works:**
- Server environment variables remain secure
- Centralized error handling and logging
- Easy to add caching, rate limiting, or authentication
- Consistent API interface regardless of backend changes

### 2. Dual-Mode Data Architecture

**Rule: Implement demo mode for development without external dependencies**

```typescript
// CRUDService with adapter pattern
export class CRUDService {
  async getAll<T>(table: string): Promise<T[]> {
    if (config.dataMode === 'demo') {
      return this.getDemoData(table)  // In-memory data
    }
    return this.xanoClient.getAll<T>(table)  // Xano API
  }
}

// Environment-based configuration
const config = {
  dataMode: (process.env.DATA_MODE as 'demo' | 'xano') || 'demo'
}
```

**Benefits:**
- Develop UI without Xano setup
- Fast iteration with predictable test data
- Easy debugging and testing
- Seamless transition to production
- Team members can work without shared credentials

### 3. Type-Safe Schema Mapping

**Rule: Define TypeScript types that exactly match Xano schema**

```typescript
// Match Xano field types exactly
interface Post {
  id: string           // Xano UUID field
  title: string        // Xano text field
  content: string      // Xano longtext field  
  published: boolean   // Xano boolean field
  created_at: number   // Xano datetime (unix timestamp)
}

// Generic CRUD interface
interface EntityMap {
  post: Post
  category: Category
  user: User
}
```

## Development Workflow

### Phase 1: Demo-First Development

```bash
# 1. Start in demo mode
echo "DATA_MODE=demo" > .env.local
npm run dev

# 2. Build complete UI with demo data
# - Forms, tables, validation
# - Error states, loading states
# - Navigation and routing
```

**Key Actions:**
- Build all CRUD operations with in-memory data
- Perfect UI/UX without external dependencies
- Implement comprehensive error handling
- Create TypeScript types for all entities

### Phase 2: Single Endpoint Integration

```bash
# 3. Switch to Xano mode
echo "DATA_MODE=xano" > .env.local
echo "XANO_BASE_URL=https://your-instance.xano.io/api:version" >> .env.local

# 4. Test ONE operation first (usually GET)
```

**Integration Checklist:**
- [ ] Environment variables configured
- [ ] Xano instance active and accessible
- [ ] API key has correct permissions
- [ ] Single GET endpoint working
- [ ] Response data matches TypeScript types

### Phase 3: Full CRUD Testing

```typescript
// Test complete lifecycle for each entity
const testCRUDCycle = async () => {
  // 1. Create new record
  const newPost = await crudService.create('post', {
    title: 'Test Post',
    content: 'Test content',
    published: false
  })
  
  // 2. Read created record
  const post = await crudService.getById('post', newPost.id)
  
  // 3. Update record
  const updated = await crudService.update('post', post.id, {
    published: true
  })
  
  // 4. Delete record
  const deleted = await crudService.delete('post', post.id)
}
```

### Phase 4: Edge Case Handling

**Required Error Scenarios:**
- Empty state (no data)
- Network timeouts
- Invalid data submissions
- Authorization failures
- Concurrent modification conflicts

## Common Pitfalls & Solutions

### 1. Environment Variable Issues

**❌ Problem: Client components can't access server environment variables**

```typescript
// ❌ WRONG: Undefined in client components
function PostList() {
  const apiKey = process.env.XANO_API_KEY // undefined
}
```

**✅ Solution: Use API routes for server-side access**

```typescript
// ✅ CORRECT: API route handles environment variables
// /app/api/posts/route.ts
export async function GET() {
  const response = await fetch(`${process.env.XANO_BASE_URL}/posts`, {
    headers: { 'Authorization': `Bearer ${process.env.XANO_API_KEY}` }
  })
}

// Client component uses API route
function PostList() {
  const posts = await fetch('/api/posts')
}
```

### 2. Xano API Response Patterns

**❌ Problem: Xano delete operations return null**

```typescript
// ❌ WRONG: Expecting success object
const result = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
const data = await result.json() // null, not { success: true }
```

**✅ Solution: Check HTTP status, not response body**

```typescript
// ✅ CORRECT: Success determined by HTTP status
async delete(table: string, id: string): Promise<boolean> {
  try {
    await this.request(`/${table}/${id}`, { method: 'DELETE' })
    return true // Success if no error thrown
  } catch (error) {
    if (error.status === 404) return false // Not found
    throw error // Other errors
  }
}
```

**❌ Problem: Xano uses PATCH instead of PUT for updates**

```typescript
// ❌ WRONG: Using PUT method
await fetch(`/api/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates)
})
```

**✅ Solution: Use PATCH method**

```typescript
// ✅ CORRECT: Xano expects PATCH
await fetch(`/api/posts/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(updates)
})
```

### 3. Data Type Mismatches

**❌ Problem: UUID vs Integer ID confusion**

```typescript
// ❌ WRONG: Treating UUIDs as integers
const postId = parseInt(xanoPost.id) // NaN
```

**✅ Solution: Handle both types in adapter layer**

```typescript
// ✅ CORRECT: Type conversion in service layer
async getById<T>(table: string, id: string): Promise<T | null> {
  if (config.dataMode === 'demo') {
    const numId = parseInt(id) // Demo uses integers
    return this.getDemoById(table, numId)
  }
  return this.xanoClient.getById<T>(table, id) // Xano uses UUIDs
}
```

## Data Layer Design

### 1. Generic CRUD Service

```typescript
// Single service handles all entities
export class CRUDService {
  async getAll<T extends EntityType>(table: T): Promise<EntityMap[T][]> {
    // Implementation switches based on data mode
  }
  
  async getById<T extends EntityType>(table: T, id: string): Promise<EntityMap[T] | null> {
    // Handle both demo (int) and Xano (UUID) IDs
  }
  
  async create<T extends EntityType>(
    table: T, 
    data: Omit<EntityMap[T], 'id' | 'created_at'>
  ): Promise<EntityMap[T]> {
    // Type-safe creation
  }
}
```

### 2. Error-Aware API Client

```typescript
export class XanoClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      // Extract meaningful error information
      let errorMessage = `HTTP ${response.status}`
      let errorCode = 'HTTP_ERROR'
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.code || errorCode
      } catch {
        // Use default if parsing fails
      }
      
      throw new XanoAPIError(errorMessage, response.status, errorCode)
    }

    return response.json()
  }
}
```

## Error Handling Strategies

### 1. Structured Error Types

```typescript
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
```

### 2. User-Friendly Error Messages

```typescript
// Map technical errors to user-friendly messages
const getErrorMessage = (error: unknown): string => {
  if (error instanceof XanoAPIError) {
    switch (error.status) {
      case 401: return 'Authentication failed. Please check your credentials.'
      case 403: return 'You do not have permission to perform this action.'
      case 404: return 'The requested item was not found.'
      case 422: return 'Please check your input and try again.'
      case 500: return 'Server error. Please try again later.'
      default: return `Error: ${error.message}`
    }
  }
  return 'An unexpected error occurred.'
}
```

### 3. Retry Logic for Network Issues

```typescript
const retryRequest = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry client errors (4xx)
      if (error instanceof XanoAPIError && error.status < 500) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  
  throw lastError
}
```

## Production Deployment

### 1. Environment Variables Checklist

```bash
# Required for Xano mode
XANO_BASE_URL=https://your-instance.xano.io/api:version
XANO_API_KEY=your-production-api-key

# Mode configuration
DATA_MODE=xano

# Optional
XANO_SWAGGER_URL=https://your-instance.xano.io/api:version/swagger.json
```

### 2. CORS Configuration

**In Xano Dashboard:**
1. Go to Settings → CORS
2. Add production domain: `https://yourapp.vercel.app`
3. Add development domain: `http://localhost:3000`
4. Enable required HTTP methods: GET, POST, PATCH, DELETE

### 3. Health Checks

```typescript
// API route for health monitoring
// /app/api/health/route.ts
export async function GET() {
  try {
    const health = await crudService.healthCheck()
    return Response.json(health)
  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    )
  }
}
```

### 4. Performance Optimization

```typescript
// Implement caching for read operations
const cache = new Map<string, { data: any; expires: number }>()

async getAll<T>(table: string): Promise<T[]> {
  const cacheKey = `${table}-all`
  const cached = cache.get(cacheKey)
  
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  
  const data = await this.request<T[]>(`/${table}`)
  cache.set(cacheKey, {
    data,
    expires: Date.now() + (5 * 60 * 1000) // 5 minutes
  })
  
  return data
}
```

## Key Takeaways

1. **Start with demo mode** - Build UI without external dependencies
2. **Use API routes as middleware** - Never call Xano directly from client components
3. **Handle Xano quirks** - PATCH not PUT, null delete responses, UUID IDs
4. **Implement error-first** - Build error handling before success cases
5. **Type everything** - Match TypeScript types exactly to Xano schema
6. **Test incrementally** - One endpoint at a time, then full CRUD cycles
7. **Plan for production** - CORS, environment variables, health checks

This guide represents real-world lessons learned from successful Next.js + Xano application development and deployment.