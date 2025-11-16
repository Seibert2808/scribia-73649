import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Calendar, FileText, BookOpen, 
  TrendingUp, Activity, ArrowLeft, Shield 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalPalestras: number;
  totalLivebooks: number;
  activeSubscriptions: number;
  tutorSessions: number;
}

interface User {
  id: string;
  nome_completo: string;
  email: string;
  cpf: string | null;
  whatsapp: string | null;
  criado_em: string;
}

interface Event {
  id: string;
  nome_evento: string;
  cidade: string | null;
  pais: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  usuario_id: string;
  criado_em: string;
}

function AdminDashboardContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalPalestras: 0,
    totalLivebooks: 0,
    activeSubscriptions: 0,
    tutorSessions: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load statistics
      const [
        usersResult,
        eventsResult,
        palestrasResult,
        livebooksResult,
        subscriptionsResult,
        tutorSessionsResult,
      ] = await Promise.all([
        supabase.from("scribia_usuarios").select("*", { count: "exact" }),
        supabase.from("scribia_eventos").select("*", { count: "exact" }),
        supabase.from("scribia_palestras").select("*", { count: "exact" }),
        supabase.from("scribia_livebooks").select("*", { count: "exact" }),
        supabase.from("scribia_assinaturas").select("*", { count: "exact" }).eq("status", "ativo"),
        supabase.from("scribia_tutor_sessions").select("*", { count: "exact" }),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalPalestras: palestrasResult.count || 0,
        totalLivebooks: livebooksResult.count || 0,
        activeSubscriptions: subscriptionsResult.count || 0,
        tutorSessions: tutorSessionsResult.count || 0,
      });

      // Load recent users
      const { data: usersData } = await supabase
        .from("scribia_usuarios")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(10);

      setUsers(usersData || []);

      // Load recent events
      const { data: eventsData } = await supabase
        .from("scribia_eventos")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(10);

      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do sistema.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando dados administrativos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 p-4 md:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              </div>
              <p className="text-muted-foreground">
                Visão geral do sistema ScribIA Plus
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Admin
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeSubscriptions} assinaturas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eventos Criados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPalestras} palestras registradas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Livebooks Gerados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLivebooks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.tutorSessions} sessões com Tutor
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Usuários Recentes</CardTitle>
                <CardDescription>Últimos 10 usuários cadastrados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{user.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.whatsapp && (
                            <p className="text-xs text-muted-foreground">
                              WhatsApp: {user.whatsapp}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(user.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Recentes</CardTitle>
                <CardDescription>Últimos 10 eventos criados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{event.nome_evento}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.cidade && event.pais
                              ? `${event.cidade}, ${event.pais}`
                              : "Local não informado"}
                          </p>
                          {event.data_inicio && (
                            <p className="text-xs text-muted-foreground">
                              Início: {format(new Date(event.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Criado em: {format(new Date(event.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Total de Usuários</span>
                    <Badge variant="outline">{stats.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Eventos Cadastrados</span>
                    <Badge variant="outline">{stats.totalEvents}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Palestras Registradas</span>
                    <Badge variant="outline">{stats.totalPalestras}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Livebooks Gerados</span>
                    <Badge variant="outline">{stats.totalLivebooks}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assinaturas & Engajamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Assinaturas Ativas</span>
                    <Badge className="bg-green-500">{stats.activeSubscriptions}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Sessões com Tutor</span>
                    <Badge variant="outline">{stats.tutorSessions}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Taxa de Conversão</span>
                    <Badge variant="outline">
                      {stats.totalUsers > 0
                        ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100)
                        : 0}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Média Livebooks/Usuário</span>
                    <Badge variant="outline">
                      {stats.totalUsers > 0
                        ? (stats.totalLivebooks / stats.totalUsers).toFixed(1)
                        : 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
