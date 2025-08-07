# Product Requirements Document (PRD)
## Next.js Xano CRUD Boilerplate

### Project Overview
A generic Next.js application that provides complete CRUD operations for any Xano database. The app works with in-memory demo data initially, then seamlessly connects to Xano via Swagger-generated endpoints.

### Core Requirements

#### 1. Generic CRUD System
- **Universal Table Support**: Handle any table structure dynamically
- **CRUD Operations**: Create, Read, Update, Delete for all tables
- **Schema-Driven**: Configuration-based field types and validation
- **Type Safety**: Full TypeScript support throughout

#### 2. Dual Data Modes
- **In-Memory Mode**: Working demo with sample data from day one
- **Xano Mode**: Connect to real Xano backend via API endpoints
- **Easy Switching**: Toggle between modes via configuration

#### 3. Dynamic UI Generation
- **Auto-Forms**: Generate create/edit forms from table schemas
- **Data Tables**: Sortable, filterable, paginated data display
- **Modal Interfaces**: Overlay dialogs for CRUD operations
- **Responsive Design**: Mobile-first responsive layout

#### 4. Admin Dashboard
- **Table Management**: Add, configure, and remove tables
- **Record Management**: Full CRUD for all table records
- **Schema Editor**: Visual interface for defining table structures
- **Demo Data**: Sample tables with realistic data

### Technical Specifications

#### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: React hooks + Context API
- **Data Layer**: Generic API client with adapter pattern
- **UI Components**: Custom components built with Tailwind
- **Development**: Hot reload, TypeScript strict mode

#### Architecture
```
/lib
  /api           # Generic CRUD client
  /types         # TypeScript definitions
  /schemas       # Table schema definitions
/components
  /crud          # Generic CRUD components
  /ui            # Base UI components
/pages
  /api           # Next.js API routes
  /admin         # Admin dashboard
/data
  /demo          # In-memory sample data
```

#### API Design
- **Generic Endpoints**: `/api/[table]/[id]` pattern
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Response Format**: Consistent JSON structure
- **Error Handling**: Standard HTTP status codes

### Integration Requirements

#### Xano Connection
- **Swagger Import**: Parse Swagger docs to generate endpoints
- **Authentication**: Support Xano API key authentication  
- **Environment Variables**: Configure endpoints via .env
- **Error Mapping**: Handle Xano-specific error responses

#### Deployment
- **Vercel Ready**: Optimized for Vercel deployment
- **GitHub Integration**: Auto-deploy from main branch
- **Environment Config**: Production environment variables
- **Build Optimization**: Fast builds and deployments

### Demo Data Structure

#### Sample Tables
1. **Users**
   - id (number), name (text), email (text), created_at (date)
2. **Posts** 
   - id (number), title (text), content (text), author_id (relation), published (boolean)
3. **Categories**
   - id (number), name (text), description (text), color (text)

#### Relationships
- Posts belong to Users (author_id → users.id)
- Posts can have Categories (many-to-many via junction table)

### Success Criteria

#### Phase 1 (In-Memory)
- [ ] Create, edit, delete records in all demo tables
- [ ] Working data tables with sorting and filtering
- [ ] Form validation and error handling
- [ ] Responsive UI on mobile and desktop

#### Phase 2 (Xano Integration)
- [ ] Connect to Xano via Swagger-generated endpoints
- [ ] Authentication with Xano API keys
- [ ] Error handling for network requests
- [ ] Production deployment to Vercel

### Deliverables

1. **Working Application**: Fully functional Next.js app
2. **Xano Schema Documentation**: Database setup instructions
3. **Integration Guide**: Steps to connect to Xano
4. **Deployment Instructions**: Vercel deployment guide

### Non-Requirements
- User authentication (handled by Xano)
- File uploads (can be added later)
- Real-time updates (WebSocket support)
- Advanced reporting features

---

**Created**: 2025-08-07  
**Last Updated**: 2025-08-07  
**Status**: In Development