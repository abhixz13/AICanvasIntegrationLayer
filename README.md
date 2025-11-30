# MCP Integration Platform

A comprehensive full-stack platform for managing MCP (Model Context Protocol) Servers and Skills across products.

## Project Overview

This is a **three-tier architecture** application:

1. **Frontend** - Next.js web application (UI)
2. **Backend** - Express.js API server (Business logic)
3. **Database** - Supabase (PostgreSQL with authentication)

The project is the result of merging two codebases:
- **Vercel/v0 Implementation** (Next.js): Authentication, onboarding, dashboard, use cases, approvals
- **Lovable Implementation** (Vite/React): Advanced Skills management system

## Architecture

```
mcp-server-registrar/
├── frontend/              # Next.js 16 web application
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── public/           # Static assets
│
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   └── server.ts     # Main entry point
│   └── package.json
│
└── supabase/             # Database schema and migrations
    └── (Supabase configuration)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Components**: shadcn/ui (48 components)
- **Styling**: Tailwind CSS 4
- **State Management**: React Query + Context API
- **TypeScript**: Full type safety

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Security**: Helmet, CORS

### Database
- **Service**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (optional)

## Features

### Authentication & Authorization ✅
- Email/password authentication
- SSO integration (Cisco SSO)
- Session management with middleware
- Role-based access control (RBAC)
- Business unit scoping

### MCP Server Management ✅
- Catalog with search and filtering
- Lifecycle state tracking
- Two registration flows (Guided + Wizard)
- Edit and manage servers
- Owner and team tracking

### Skills Management ✅ (Unique Feature)
- Complete skill catalog
- 5-step creation wizard
- Risk type classification (read, write, automation)
- Data sensitivity levels
- Human approval requirements
- Call volume and success rate tracking

### Business Use Cases ✅
- Create and manage use cases
- Map to MCP servers
- Approval workflow integration
- Status tracking

### Approval Workflows ✅
- Dedicated approvals dashboard
- Timeline visualization
- Role-based routing
- Multi-level approvals

### Dashboard & Analytics ✅
- PM Overview dashboard
- Integration coverage metrics
- Velocity tracking
- Use case coverage by business unit

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd mcp-server-registrar
```

#### 2. Set Up Frontend

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

#### 3. Set Up Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Backend API will be available at: **http://localhost:3001**

### Environment Variables

#### Frontend (.env)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

### Database Setup (Supabase)

The application uses the following Supabase tables:
- `business_units` - Business unit definitions
- `user_profiles` - User profile information
- `roles` - Available roles
- `user_profile_roles` - User role assignments
- `mcp_servers` - MCP server registry
- `business_use_cases` - Business use case tracking
- `use_case_approvals` - Approval workflow records
- `products` - Product catalog

**Note**: Skills feature currently uses mock data. Database migration can be added later.

## Development

### Frontend Development

```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linter
```

### Backend Development

```bash
cd backend
npm run dev        # Start dev server with auto-reload
npm run build      # Compile TypeScript
npm run start      # Run compiled code
npm test           # Run tests
```

## Project Structure

### Frontend (`/frontend`)

```
frontend/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── onboarding/        # User onboarding
│   ├── dashboard/         # Main dashboard
│   ├── skills/            # Skills management
│   ├── mcp/               # MCP catalog
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components (48)
│   ├── app-shell/        # App layout components
│   ├── wizard/           # Wizard components
│   └── mcp/              # MCP components
│
├── lib/                   # Utilities
│   ├── supabase/         # Supabase client (SSR)
│   ├── hooks/            # Custom hooks
│   ├── contexts/         # Context providers
│   ├── data/             # Mock data
│   └── types/            # TypeScript types
│
└── public/               # Static assets
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── server.ts         # Main entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
│
├── config/               # Configuration files
└── package.json
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### MCP Servers
- `GET /api/v1/mcp-servers` - List all servers
- `GET /api/v1/mcp-servers/:id` - Get server details
- `POST /api/v1/mcp-servers` - Create server
- `PUT /api/v1/mcp-servers/:id` - Update server
- `DELETE /api/v1/mcp-servers/:id` - Delete server

### Skills
- `GET /api/v1/skills` - List all skills
- `GET /api/v1/skills/:id` - Get skill details
- `POST /api/v1/skills` - Create skill
- `PUT /api/v1/skills/:id` - Update skill
- `DELETE /api/v1/skills/:id` - Delete skill

### Use Cases
- `GET /api/v1/use-cases` - List use cases
- `POST /api/v1/use-cases` - Create use case
- `PUT /api/v1/use-cases/:id` - Update use case

### Approvals
- `GET /api/v1/approvals` - List approvals
- `POST /api/v1/approvals/:id/approve` - Approve
- `POST /api/v1/approvals/:id/reject` - Reject

## Routes (Frontend)

### Public Routes
- `/` - Home (redirects based on auth)
- `/auth/login` - Login
- `/auth/sign-up` - Registration
- `/auth/forgot-password` - Password recovery

### Protected Routes
- `/dashboard` - Main dashboard
- `/dashboard/mcp-servers` - MCP catalog
- `/dashboard/use-cases` - Use cases
- `/dashboard/approvals` - Approvals
- `/skills` - Skills catalog
- `/skills/manage` - Manage skills
- `/skills/[id]` - Skill details
- `/new-skill` - Create skill

## Security

### Frontend
- Next.js middleware for route protection
- Supabase Auth with JWT tokens
- Environment variables for secrets
- HTTPS in production

### Backend
- Helmet.js for security headers
- CORS configured for frontend only
- Input validation with Zod
- Supabase Row Level Security (RLS)

## Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Heroku/Railway/Render)
```bash
cd backend
npm run build
# Deploy to your platform
```

## Documentation

- **Frontend README**: `/frontend/README.md`
- **Backend README**: `/backend/README.md`
- **Merge Summary**: `/MERGE_SUMMARY.md`

## Contributing

This is an internal platform. For issues or feature requests, contact the platform team.

## Support

For questions or issues:
1. Check the documentation
2. Review the README files
3. Contact the development team

## License

Internal use only - Proprietary

---

**Version**: 0.1.0
**Last Updated**: November 30, 2025
