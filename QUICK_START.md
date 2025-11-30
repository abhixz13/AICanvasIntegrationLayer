# Quick Start Guide

Get the MCP Integration Platform running in minutes.

## Project Structure

```
mcp-server-registrar/
├── frontend/          # Next.js web application (Port 3000)
├── backend/           # Express.js API server (Port 3001)
└── supabase/          # Database configuration
```

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or pnpm installed
- ✅ Supabase account created

## Step 1: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

✅ **Frontend running at: http://localhost:3000**

## Step 2: Backend Setup (Optional)

The backend is optional for initial testing as the frontend can communicate directly with Supabase.

```bash
# Open a new terminal
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your configuration:
# PORT=3001
# NODE_ENV=development
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# FRONTEND_URL=http://localhost:3000

# Start the development server
npm run dev
```

✅ **Backend running at: http://localhost:3001**

## Step 3: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/health

### First Time Access

1. You'll be redirected to `/auth/login`
2. Click "Sign Up" to create an account
3. Complete the onboarding process
4. Start using the platform!

## Features to Explore

### 1. Dashboard
- Navigate to `/dashboard` after login
- View PM overview and analytics
- See integration coverage metrics

### 2. MCP Servers
- Go to `/dashboard/mcp-servers`
- Browse the MCP catalog
- Register new MCP servers (Guided or Wizard flow)

### 3. Skills Management
- Navigate to `/skills`
- Browse skill catalog
- Create new skills with the 5-step wizard
- Manage existing skills at `/skills/manage`

### 4. Business Use Cases
- Go to `/dashboard/use-cases`
- Create and manage use cases
- Map use cases to MCP servers

### 5. Approvals
- Check `/dashboard/approvals`
- View pending approvals
- Approve or reject requests

## Common Issues

### Port Already in Use
If port 3000 or 3001 is already in use:

```bash
# Frontend - use different port
PORT=3002 npm run dev

# Backend - edit .env
PORT=3002
```

### Supabase Connection Error
- Verify your `.env` file has correct credentials
- Check that SUPABASE_URL starts with `https://`
- Ensure SUPABASE_ANON_KEY is the anon/public key

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Check for errors
```

### Backend Development
```bash
cd backend
npm run dev       # Start with auto-reload
npm run build     # Compile TypeScript
npm test          # Run tests
```

## Project Organization

### Frontend Key Directories
- `app/` - Next.js pages and routes
- `components/` - Reusable React components
- `lib/` - Utilities, hooks, and data
- `public/` - Static assets

### Backend Key Directories
- `src/` - Source code
- `routes/` - API route handlers
- `controllers/` - Business logic
- `middleware/` - Custom middleware

## Database (Supabase)

The application uses Supabase for:
- **Authentication**: User login and session management
- **Database**: PostgreSQL with Row Level Security
- **Storage**: File uploads (if needed)
- **Real-time**: Live updates (optional)

### Key Tables
- `business_units` - Business unit data
- `user_profiles` - User information
- `mcp_servers` - MCP server registry
- `business_use_cases` - Use cases
- `skills` - Skills data (to be migrated from mock data)

## Next Steps

1. ✅ **Explore the Dashboard** - Get familiar with the interface
2. ✅ **Create Test Data** - Add MCP servers and skills
3. ✅ **Configure Roles** - Set up user roles and permissions
4. ✅ **Test Workflows** - Try the approval workflow
5. ✅ **Review API** - Check backend endpoints

## Additional Resources

- **Main README**: `/README.md`
- **Frontend Docs**: `/frontend/README.md`
- **Backend Docs**: `/backend/README.md`
- **Merge Summary**: `/MERGE_SUMMARY.md`

## Support

For help:
1. Check the documentation
2. Review error messages in browser console
3. Check terminal output for backend errors
4. Contact the development team

---

**Happy Coding!** 🚀
