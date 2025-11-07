import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ParticipantesLanding from "./pages/ParticipantesLanding";
import NotFound from "./pages/NotFound";
import TesteGratuito from "./pages/TesteGratuito";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Events from "./pages/dashboard/Events";
import Livebooks from "./pages/dashboard/Livebooks";
import EventosDashboard from "./pages/dashboard/EventosDashboard";
import PalestrasList from "./pages/palestras/PalestrasList";
import PalestraForm from "./pages/palestras/PalestraForm";
import PalestraDetalhe from "./pages/palestras/PalestraDetalhe";
import LivebooksList from "./pages/livebooks/LivebooksList";
import TutorChat from "./pages/tutor/TutorChat";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrganizadorLayout from "./components/organizador/OrganizadorLayout";
import Navbar from "./components/sections/Navbar";
import { AuthGuard } from "./components/auth/AuthGuard";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/participantes" element={
              <>
                <Navbar />
                <ParticipantesLanding />
              </>
            } />
            <Route path="/teste-gratuito" element={<TesteGratuito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/dashboard/*" element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            } />
            <Route path="/dashboard-old" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/eventos" element={
              <AuthGuard>
                <EventosDashboard />
              </AuthGuard>
            } />
            <Route path="/eventos/:eventoId/palestras" element={
              <AuthGuard>
                <PalestrasList />
              </AuthGuard>
            } />
            <Route path="/eventos/:eventoId/palestras/nova" element={
              <AuthGuard>
                <PalestraForm />
              </AuthGuard>
            } />
            <Route path="/eventos/:eventoId/palestras/:palestraId" element={
              <AuthGuard>
                <PalestraDetalhe />
              </AuthGuard>
            } />
            <Route path="/eventos/:eventoId/palestras/:palestraId/editar" element={
              <AuthGuard>
                <PalestraForm />
              </AuthGuard>
            } />
            <Route path="/livebooks" element={
              <AuthGuard>
                <LivebooksList />
              </AuthGuard>
            } />
            <Route path="/eventos/:eventoId/livebooks" element={
              <AuthGuard>
                <LivebooksList />
              </AuthGuard>
            } />
            <Route path="/tutor" element={
              <AuthGuard>
                <TutorChat />
              </AuthGuard>
            } />
            <Route path="/organizador/*" element={
              <AuthGuard>
                <OrganizadorLayout />
              </AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
