# Next.js Xano CRUD Boilerplate

A generic Next.js application providing complete CRUD operations for any Xano database. Works with demo data initially, then seamlessly connects to Xano via Swagger endpoints.

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd young-life
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the admin dashboard with demo data.

## ✨ Features

- **Generic CRUD**: Works with any table structure
- **Dual Modes**: In-memory demo data + Xano backend connection
- **Auto-Generated UI**: Forms and tables created from schemas
- **TypeScript**: Full type safety throughout
- **Responsive**: Mobile-first design with Tailwind CSS
- **Vercel Ready**: Optimized for deployment

## 🏗️ Architecture

```
lib/
├── api/          # Generic CRUD client
├── types/        # TypeScript definitions
└── schemas/      # Table configurations

components/
├── crud/         # Generic CRUD components
└── ui/           # Base UI components

data/
└── demo/         # In-memory sample data
```

## 🔄 Development Workflow

### Phase 1: Demo Mode (Current)
- Working CRUD with in-memory data
- Three sample tables: Users, Posts, Categories
- Full admin interface

### Phase 2: Xano Integration
1. Set up Xano database using provided schemas
2. Generate Swagger documentation in Xano
3. Configure environment variables
4. Switch to Xano mode

## 🔗 Xano Connection

### Environment Variables
```bash
# .env.local
XANO_BASE_URL=https://your-instance.xano.io/api:version
XANO_API_KEY=your-api-key
DATA_MODE=xano  # or 'demo' for in-memory
```

### Database Schema
See `docs/XANO_SCHEMA.md` for complete database setup instructions.

## 📱 Demo Tables

- **Users**: id, name, email, created_at
- **Posts**: id, title, content, author_id, published
- **Categories**: id, name, description, color

## 🛠️ Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
```

## 🚢 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm run start
```

## 📋 Requirements

- Node.js 18+
- Xano account (for backend)
- Vercel account (for deployment)

## 🏃‍♂️ Development Status

- ✅ PRD and documentation structure
- ⏳ Next.js setup and core components
- ⏳ CRUD functionality with demo data
- ⏳ Xano integration layer
- ⏳ Admin interface
- ⏳ Production deployment

## 📖 Documentation

- [Product Requirements](PRD.md)
- [API Reference](docs/API.md)
- [Xano Integration](docs/XANO_INTEGRATION.md)
- [Component Guide](docs/COMPONENTS.md)

---

Built with Next.js 14, TypeScript, and Tailwind CSS