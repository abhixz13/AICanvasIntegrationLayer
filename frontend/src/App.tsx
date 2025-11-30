import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

// Auth pages
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/sign-up";
import SignUpSuccess from "./pages/auth/sign-up-success";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import AuthError from "./pages/auth/error";

// Main pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/dashboard/Dashboard";
import Approvals from "./pages/dashboard/Approvals";

// MCP Server pages
import MCPServers from "./pages/dashboard/mcp-servers/MCPServers";
import MCPServerDetail from "./pages/dashboard/mcp-servers/MCPServerDetail";
import MCPServerEdit from "./pages/dashboard/mcp-servers/MCPServerEdit";

// Use Cases pages
import UseCases from "./pages/dashboard/use-cases/UseCases";
import NewUseCase from "./pages/dashboard/use-cases/NewUseCase";
import UseCaseDetail from "./pages/dashboard/use-cases/UseCaseDetail";

// Skills pages
import SkillCatalog from "./pages/SkillCatalog";
import SkillManage from "./pages/SkillManage";
import SkillDetail from "./pages/SkillDetail";
import NewSkillWizard from "./pages/NewSkillWizard";

// MCP Catalog pages
import MCPCatalog from "./pages/MCPCatalog";
import MCPDetail from "./pages/MCPDetail";

// Register pages
import GuidedCreate from "./pages/GuidedCreate";
import RegisterWizard from "./pages/RegisterWizard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/sign-up-success" element={<SignUpSuccess />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/error" element={<AuthError />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/approvals" element={<Approvals />} />

            {/* MCP Server routes */}
            <Route path="/dashboard/mcp-servers" element={<MCPServers />} />
            <Route path="/dashboard/mcp-servers/:id" element={<MCPServerDetail />} />
            <Route path="/dashboard/mcp-servers/:id/edit" element={<MCPServerEdit />} />

            {/* Use Cases routes */}
            <Route path="/dashboard/use-cases" element={<UseCases />} />
            <Route path="/dashboard/use-cases/new" element={<NewUseCase />} />
            <Route path="/dashboard/use-cases/:id" element={<UseCaseDetail />} />

            {/* Skills routes */}
            <Route path="/skills" element={<SkillCatalog />} />
            <Route path="/skills/manage" element={<SkillManage />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            <Route path="/new-skill" element={<NewSkillWizard />} />

            {/* MCP Catalog routes */}
            <Route path="/mcp" element={<MCPCatalog />} />
            <Route path="/mcp/:id" element={<MCPDetail />} />

            {/* Register routes */}
            <Route path="/register/guided" element={<GuidedCreate />} />
            <Route path="/register/wizard" element={<RegisterWizard />} />

            {/* 404 - Catch all */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
