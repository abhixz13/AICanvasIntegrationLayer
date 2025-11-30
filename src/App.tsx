import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MCPCatalog from "./pages/MCPCatalog";
import GuidedCreate from "./pages/GuidedCreate";
import RegisterWizard from "./pages/RegisterWizard";
import SkillCatalog from "./pages/SkillCatalog";
import SkillManage from "./pages/SkillManage";
import SkillDetail from "./pages/SkillDetail";
import NewSkillWizard from "./pages/NewSkillWizard";
import MCPDetail from "./pages/MCPDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-14 border-b border-border bg-card flex items-center px-4">
                <SidebarTrigger />
              </header>
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<MCPCatalog />} />
                  <Route path="/mcp/:id" element={<MCPDetail />} />
                  <Route path="/register/guided" element={<GuidedCreate />} />
                  <Route path="/register/wizard" element={<RegisterWizard />} />
                  <Route path="/skills" element={<SkillCatalog />} />
                  <Route path="/skills/manage" element={<SkillManage />} />
                  <Route path="/skills/:id" element={<SkillDetail />} />
                  <Route path="/new-skill" element={<NewSkillWizard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
