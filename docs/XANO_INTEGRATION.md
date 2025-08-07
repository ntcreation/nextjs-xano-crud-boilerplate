# Next.js + Xano Integration Guide

Complete guide for building production-ready Next.js applications with Xano backend integration. This guide includes proven patterns, common pitfalls, and architectural decisions learned from real project development.

## Development Lessons Learned

Based on successful deployment of a complete Next.js + Xano CRUD application, these are the critical patterns and solutions that ensure smooth development.

## Critical Architecture Patterns

### 1. API Route Middleware Pattern
**ALWAYS use Next.js API routes as middleware between frontend and Xano**

**Why**: Next.js client-side components cannot directly access server environment variables. API routes provide secure server-side access to Xano credentials.

```typescript
// ✅ CORRECT: API route handles Xano communication
// /app/api/posts/route.ts
export async function GET() {
  const response = await fetch(`${process.env.XANO_BASE_URL}/posts`, {
    headers: { 'Authorization': `Bearer ${process.env.XANO_API_KEY}` }
  })
  return Response.json(await response.json())
}

// ❌ WRONG: Client component cannot access XANO_API_KEY
function PostList() {
  const fetchPosts = async () => {
    const response = await fetch(`${process.env.XANO_BASE_URL}/posts`) // undefined
  }
}
```

### 2. Dual-Mode Data Architecture
**Implement demo mode for development without Xano dependency**

```typescript
// Adapter pattern allows switching between data sources
export class CRUDService {
  async getAll<T>(table: string): Promise<T[]> {
    if (config.dataMode === 'demo') {
      return this.getDemoData(table)  // In-memory data
    }
    return this.xanoClient.getAll<T>(table)  // Xano API
  }
}
```

**Benefits**:
- Develop UI without Xano setup
- Fast iteration with predictable test data
- Easy debugging and testing
- Seamless transition to production

### 3. Error Handling Patterns

**Handle Xano-specific response patterns**:

```typescript
// Xano delete operations return null, not success objects
async delete(table: string, id: string): Promise<boolean> {
  try {
    await this.request(`/${table}/${id}`, { method: 'DELETE' })
    return true // Success if no error thrown
  } catch (error) {
    if (error.status === 404) return false
    throw error
  }
}

// Xano uses PATCH, not PUT for updates  
async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
  return this.request<T>(`/${table}/${id}`, {
    method: 'PATCH', // Not PUT!
    body: JSON.stringify(data)
  })
}
```

## Step 1: Environment Configuration

1. **Copy your Xano credentials** from the Xano dashboard
2. **Edit `.env.local`** in your project root:

```bash
# Change from demo to xano mode
DATA_MODE=xano

# Add your Xano credentials
XANO_BASE_URL=https://your-instance.xano.io/api:version
XANO_API_KEY=your-api-key-here
XANO_SWAGGER_URL=https://your-instance.xano.io/api:version/swagger.json
```

## Step 2: Test the Connection

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your admin dashboard:** `http://localhost:3000/admin`

3. **Check the status indicator** - it should show "Xano Mode" instead of "Demo Mode"

## Step 3: Verify API Endpoints

The application will automatically switch to using your Xano database. Test the following:

### Test Users
- **List users:** Visit `/admin/users`
- **Create user:** Click "Add User" and fill in the form
- **Edit user:** Click edit on any user
- **Delete user:** Click delete on any user

### Test Posts  
- **List posts:** Visit `/admin/posts`
- **Create post:** Click "Add Post" and fill in the form
- **Edit post:** Click edit on any post
- **Delete post:** Click delete on any post

### Test Categories
- **List categories:** Visit `/admin/categories`
- **Create category:** Click "Add Category" and fill in the form
- **Edit category:** Click edit on any category
- **Delete category:** Click delete on any category

## Data Type Handling Patterns

### Xano vs Traditional Database Differences

**UUID vs Integer IDs**:
```typescript
// Xano uses UUID strings, not integer auto-increment
interface XanoEntity {
  id: string          // UUID like "123e4567-e89b-12d3-a456-426614174000"
  created_at: number  // Unix timestamp, not ISO string
}

interface TraditionalEntity {
  id: number          // Auto-increment integer  
  created_at: string  // ISO string like "2024-01-01T00:00:00Z"
}

// Type conversion utilities
const convertXanoTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString()
}
```

**Handle Mixed Data Sources**:
```typescript
// Demo mode uses integers, Xano uses UUIDs
async getById<T>(table: string, id: string): Promise<T | null> {
  if (config.dataMode === 'demo') {
    const numId = parseInt(id) // Convert string to number for demo
    return this.getDemoById(table, numId)
  }
  return this.xanoClient.getById<T>(table, id) // Use UUID as-is
}
```

## Step 4: Common Issues & Solutions

### Environment Variable Issues

**❌ "Missing required Xano environment variables"**
```bash
# ✅ SOLUTION: Verify environment variables are loaded
echo $XANO_BASE_URL
echo $XANO_API_KEY

# Common causes:
# 1. Missing .env.local file
# 2. Variables not prefixed with NEXT_PUBLIC_ (for client-side access)  
# 3. Development server not restarted after env changes
```

**❌ Client components can't access server environment variables**
```typescript
// ❌ WRONG: Undefined in client components
const apiKey = process.env.XANO_API_KEY // undefined

// ✅ CORRECT: Use API routes for server-side access
const response = await fetch('/api/posts') // API route handles env vars
```

### Xano API Quirks

**❌ HTTP 401 Authentication Errors**
```typescript
// ✅ SOLUTION: Check authorization header format
headers: {
  'Authorization': `Bearer ${apiKey}`, // Note: "Bearer " prefix required
  'Content-Type': 'application/json'
}

// Common mistakes:
// - Missing "Bearer " prefix
// - Expired API key
// - Wrong API key permissions in Xano dashboard
```

**❌ CORS Errors in Production**
```bash
# ✅ SOLUTION: Configure Xano CORS settings
# 1. Go to Xano Dashboard > Settings > CORS
# 2. Add your production domain: https://yourapp.vercel.app
# 3. Include localhost for development: http://localhost:3000
```

**❌ Database Schema Mismatches**
```typescript
// ✅ SOLUTION: Always match Xano field types exactly
interface Post {
  id: string           // Xano UUID field
  title: string        // Xano text field
  content: string      // Xano longtext field  
  published: boolean   // Xano boolean field
  created_at: number   // Xano datetime field (unix timestamp)
}
```

### Testing API Directly

You can test your Xano API directly with curl:

```bash
# Test get all users
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://your-instance.xano.io/api:version/users"

# Test create user  
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' \
  "https://your-instance.xano.io/api:version/users"
```

## Step 5: Switch Back to Demo Mode

If you need to switch back to demo mode:

1. **Edit `.env.local`:**
   ```bash
   DATA_MODE=demo
   ```

2. **Restart the development server**
3. **Visit `/admin`** - should show "Demo Mode"

## Development Workflow Best Practices

### 1. Start with Demo Mode
```bash
# Always begin development in demo mode
DATA_MODE=demo npm run dev

# Benefits:
# - No external dependencies  
# - Fast UI iteration
# - Predictable test data
# - Easy debugging
```

### 2. Incremental Xano Integration
```typescript
// Phase 1: Build UI with demo data
const posts = await crudService.getAll('post') // Uses demo data

// Phase 2: Test single API endpoint  
DATA_MODE=xano npm run dev
// Test one operation: GET /api/posts

// Phase 3: Test full CRUD cycle
// Create → Read → Update → Delete

// Phase 4: Handle edge cases
// Empty states, validation errors, network failures
```

### 3. Error-First Development
```typescript
// Always implement error handling before success cases
async create<T>(table: string, data: T): Promise<T> {
  try {
    const response = await this.xanoClient.create(table, data)
    return response
  } catch (error) {
    // Handle specific Xano error patterns FIRST
    if (error instanceof XanoAPIError) {
      // Log specific error details for debugging
      console.error('Xano API Error:', {
        status: error.status,
        message: error.message,
        table,
        data
      })
    }
    throw error // Re-throw for UI error handling
  }
}
```

### 4. Type-First Database Design
```typescript
// Define types BEFORE building Xano schema
interface Post {
  id: string
  title: string
  content: string
  published: boolean
  created_at: number
}

// Then build Xano schema to match types exactly
// This prevents runtime type mismatches
```

## Advanced Configuration

### Custom Field Mappings

If your Xano database has different field names, you can customize the mappings in:
- `src/lib/types/index.ts` - Update type definitions
- `src/data/demo/index.ts` - Update demo data structure
- `src/lib/api/crud-service.ts` - Add field mapping logic

### Error Handling

The application includes comprehensive error handling:
- **Network errors** - Connection timeouts, server errors
- **Validation errors** - Missing required fields, invalid data
- **Authorization errors** - Invalid API keys, expired tokens

Errors are displayed in the UI with helpful messages and suggested solutions.

## Security Notes

⚠️ **Never commit API keys to version control**
- Use `.env.local` for local development
- Use environment variables in production (Vercel, Netlify, etc.)
- Regenerate API keys if accidentally exposed

🔒 **Production Deployment**
- Set environment variables in your deployment platform
- Use different Xano instances for development/staging/production
- Enable CORS settings in Xano for your domain

---

**Next Steps:**
- [Deploy to Production](./DEPLOYMENT.md)
- [Customize UI Components](./COMPONENTS.md)
- [Add Authentication](./AUTH.md)