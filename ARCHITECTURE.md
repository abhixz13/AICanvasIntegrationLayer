# System Architecture

## Overview

The MCP Integration Platform follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                          │
│                    (Web Browser / Mobile)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                         │
│                  Frontend (Next.js 16)                       │
│                    Port 3000                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  App Router  │  Components  │  Hooks  │  Services   │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         REST API                  Direct Connection
          (3001)                    (Supabase Auth)
                │                       │
                ↓                       ↓
┌─────────────────────────┐  ┌─────────────────────────────┐
│    APPLICATION TIER     │  │       DATA TIER             │
│  Backend (Express.js)   │  │   Supabase PostgreSQL       │
│      Port 3001          │  │   + Authentication          │
│  ┌─────────────────┐   │  │   + Storage                 │
│  │ Routes          │   │  │   + Real-time               │
│  │ Controllers     │───┼──│                             │
│  │ Middleware      │   │  │  ┌─────────────────────┐   │
│  │ Business Logic  │   │  │  │ Tables:             │   │
│  └─────────────────┘   │  │  │ - mcp_servers       │   │
└─────────────────────────┘  │  │ - skills            │   │
                             │  │ - use_cases         │   │
                             │  │ - user_profiles     │   │
                             │  │ - approvals         │   │
                             │  └─────────────────────┘   │
                             └─────────────────────────────┘
```

## Architecture Components

### 1. Frontend (Presentation Tier)

**Technology**: Next.js 16 with React 19
**Port**: 3000
**Location**: `/frontend`

#### Responsibilities
- User interface rendering
- Client-side routing
- Form validation
- State management
- API communication
- Authentication UI

#### Key Features
- **App Router**: File-based routing with layouts
- **Server Components**: Improved performance
- **Client Components**: Interactive UI elements
- **Middleware**: Route protection
- **SSR/SSG**: Server-side and static generation

#### Structure
```
frontend/
├── app/                    # Routes and pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   ├── skills/            # Skills management
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── app-shell/        # Layout components
│   └── wizard/           # Multi-step forms
│
└── lib/                   # Utilities
    ├── supabase/         # Supabase client
    ├── hooks/            # Custom hooks
    └── contexts/         # React contexts
```

### 2. Backend (Application Tier)

**Technology**: Express.js with TypeScript
**Port**: 3001
**Location**: `/backend`

#### Responsibilities
- Business logic processing
- API endpoint management
- Request validation
- Data transformation
- Complex queries
- Third-party integrations

#### Structure
```
backend/
├── src/
│   ├── server.ts          # Entry point
│   ├── routes/            # API routes
│   │   ├── mcpServers.ts
│   │   ├── skills.ts
│   │   └── useCases.ts
│   │
│   ├── controllers/       # Request handlers
│   │   ├── mcpServers.ts
│   │   ├── skills.ts
│   │   └── useCases.ts
│   │
│   ├── middleware/        # Custom middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   │
│   └── utils/            # Helper functions
│       ├── supabase.ts
│       └── validators.ts
│
└── config/               # Configuration
```

### 3. Database (Data Tier)

**Technology**: Supabase (PostgreSQL)
**Location**: Cloud (Supabase.co)

#### Services
- **PostgreSQL Database**: Main data storage
- **Authentication**: JWT-based auth
- **Storage**: File uploads
- **Real-time**: WebSocket subscriptions
- **Row Level Security**: Database-level security

#### Database Schema

```sql
-- Core Tables
business_units
├── id (uuid, PK)
├── name (text)
├── description (text)
└── created_at (timestamp)

user_profiles
├── id (uuid, PK, FK → auth.users)
├── email (text)
├── full_name (text)
├── onboarded (boolean)
└── business_unit_id (uuid, FK → business_units)

mcp_servers
├── id (uuid, PK)
├── name (text)
├── description (text)
├── lifecycle_state (enum)
├── owner_email (text)
├── business_unit_id (uuid, FK → business_units)
└── created_at (timestamp)

skills
├── id (uuid, PK)
├── mcp_server_id (uuid, FK → mcp_servers)
├── name (text)
├── description (text)
├── risk_type (enum: read, write, automation)
├── data_sensitivity (enum: none, pii, secrets, config_change)
├── lifecycle_state (enum)
└── created_at (timestamp)

business_use_cases
├── id (uuid, PK)
├── title (text)
├── description (text)
├── status (enum)
├── business_unit_id (uuid, FK → business_units)
└── created_at (timestamp)

use_case_approvals
├── id (uuid, PK)
├── use_case_id (uuid, FK → business_use_cases)
├── approver_id (uuid, FK → user_profiles)
├── status (enum: pending, approved, rejected)
└── created_at (timestamp)
```

## Data Flow

### 1. Authentication Flow

```
User Login
    ↓
Frontend → Supabase Auth
    ↓
JWT Token Generated
    ↓
Token Stored (Cookie/LocalStorage)
    ↓
Middleware Validates Token
    ↓
User Redirected to Dashboard
```

### 2. Data Read Flow

```
User Request (GET)
    ↓
Frontend Component
    ↓
React Query / API Call
    ↓
Backend API Endpoint (Optional)
    ↓
Supabase Query
    ↓
RLS Policy Check
    ↓
Data Returned
    ↓
Frontend Renders UI
```

### 3. Data Write Flow

```
User Submits Form
    ↓
Frontend Validation (Zod)
    ↓
API Request (POST/PUT)
    ↓
Backend Validation
    ↓
Business Logic
    ↓
Supabase Insert/Update
    ↓
RLS Policy Check
    ↓
Success Response
    ↓
Frontend Updates State
    ↓
UI Re-renders
```

### 4. Approval Workflow

```
User Creates Use Case
    ↓
Status: draft
    ↓
User Submits for Approval
    ↓
Status: pending_approval
    ↓
Approval Record Created
    ↓
Notification Sent to Approver
    ↓
Approver Reviews
    ↓
Approve/Reject Decision
    ↓
Status Updated
    ↓
Notification to Creator
```

## Security Architecture

### Frontend Security
- **HTTPS Only**: All connections encrypted
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Input sanitization
- **CSRF Tokens**: For state-changing operations
- **Environment Variables**: Secrets not in code

### Backend Security
- **Helmet.js**: Security headers
- **CORS**: Restricted to frontend origin
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schemas
- **JWT Verification**: Token validation

### Database Security
- **Row Level Security (RLS)**: Database-level access control
- **Service Role Key**: Backend-only access
- **Anon Key**: Limited frontend access
- **Encrypted Connections**: SSL/TLS
- **Audit Logs**: Track all changes

## Scalability Considerations

### Horizontal Scaling
- Frontend: CDN + multiple instances
- Backend: Load balancer + multiple instances
- Database: Supabase handles scaling

### Caching Strategy
- **Frontend**: React Query cache
- **Backend**: Redis (planned)
- **Database**: Supabase connection pooling
- **CDN**: Static asset caching

### Performance Optimization
- **Code Splitting**: Next.js automatic splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React lazy + Suspense
- **Database Indexes**: On frequently queried columns
- **Query Optimization**: Efficient Supabase queries

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:3001)
└── Supabase (cloud)
```

### Production
```
┌─────────────────────────────────────┐
│           CDN (Vercel)              │
│      Static Assets + Edge           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│      Frontend (Vercel/Netlify)      │
│        Serverless Functions          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│    Backend (Railway/Render/Heroku)  │
│      Express.js on Node.js           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│         Supabase Cloud              │
│  Database + Auth + Storage           │
└─────────────────────────────────────┘
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 | React framework with SSR |
| **UI Library** | React 19 | Component library |
| **UI Components** | shadcn/ui | Accessible components |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **State Management** | React Query | Server state caching |
| **Backend** | Express.js | REST API server |
| **Language** | TypeScript | Type safety |
| **Validation** | Zod | Schema validation |
| **Database** | PostgreSQL | Relational database |
| **Auth** | Supabase Auth | JWT authentication |
| **Hosting** | Vercel + Railway | Cloud deployment |

## API Design Principles

### RESTful Conventions
- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT/PATCH**: Update resources
- **DELETE**: Remove resources

### Response Format
```json
{
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2025-11-30T...",
    "version": "1.0"
  }
}
```

### Error Handling
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

## Future Architecture Enhancements

1. **Microservices**: Split backend into services
2. **Message Queue**: RabbitMQ/Redis for async tasks
3. **GraphQL**: Alternative to REST API
4. **WebSockets**: Real-time updates
5. **Elasticsearch**: Advanced search
6. **Redis**: Caching layer
7. **Docker**: Containerization
8. **Kubernetes**: Orchestration

---

**Document Version**: 1.0
**Last Updated**: November 30, 2025
