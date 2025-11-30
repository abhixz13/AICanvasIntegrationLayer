# Backend API Server

Express.js backend API server for the MCP Integration Platform.

## Structure

```
backend/
├── src/
│   ├── server.ts           # Main server entry point
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── config/                 # Configuration files
├── package.json
├── tsconfig.json
└── .env.example
```

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   FRONTEND_URL=http://localhost:3000
   ```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API v1
- `GET /api/v1` - API information and available endpoints

### Planned Endpoints

**MCP Servers**
- `GET /api/v1/mcp-servers` - List all MCP servers
- `GET /api/v1/mcp-servers/:id` - Get MCP server details
- `POST /api/v1/mcp-servers` - Create new MCP server
- `PUT /api/v1/mcp-servers/:id` - Update MCP server
- `DELETE /api/v1/mcp-servers/:id` - Delete MCP server

**Skills**
- `GET /api/v1/skills` - List all skills
- `GET /api/v1/skills/:id` - Get skill details
- `POST /api/v1/skills` - Create new skill
- `PUT /api/v1/skills/:id` - Update skill
- `DELETE /api/v1/skills/:id` - Delete skill
- `POST /api/v1/skills/:id/test` - Test skill execution

**Use Cases**
- `GET /api/v1/use-cases` - List all use cases
- `GET /api/v1/use-cases/:id` - Get use case details
- `POST /api/v1/use-cases` - Create new use case
- `PUT /api/v1/use-cases/:id` - Update use case
- `DELETE /api/v1/use-cases/:id` - Delete use case

**Approvals**
- `GET /api/v1/approvals` - List pending approvals
- `GET /api/v1/approvals/:id` - Get approval details
- `POST /api/v1/approvals/:id/approve` - Approve request
- `POST /api/v1/approvals/:id/reject` - Reject request

**Users**
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile

## Authentication

The backend uses Supabase for authentication. All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database

The backend connects to Supabase PostgreSQL database with the following tables:
- `business_units`
- `user_profiles`
- `roles`
- `user_profile_roles`
- `mcp_servers`
- `business_use_cases`
- `use_case_approvals`
- `products`

## Development

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Create controller in `src/controllers/`
3. Add middleware if needed in `src/middleware/`
4. Import and use in `src/server.ts`

### Example Route Structure

```typescript
// src/routes/mcpServers.ts
import { Router } from 'express';
import { getMcpServers, getMcpServerById } from '../controllers/mcpServers';

const router = Router();

router.get('/', getMcpServers);
router.get('/:id', getMcpServerById);

export default router;
```

### Example Controller

```typescript
// src/controllers/mcpServers.ts
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function getMcpServers(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*');

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch MCP servers' });
  }
}
```

## Testing

```bash
npm test
```

## Security

- Helmet.js for security headers
- CORS configured for frontend origin only
- Environment variables for sensitive data
- Supabase Row Level Security (RLS) policies

## Future Enhancements

- [ ] Implement all CRUD endpoints
- [ ] Add request validation with Zod
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add comprehensive error handling
- [ ] Add logging service integration
- [ ] Add unit and integration tests
- [ ] Add API versioning
- [ ] Add caching layer (Redis)
- [ ] Add WebSocket support for real-time updates
