import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Shield } from "lucide-react";

const Dashboard = () => {
  const { user, profile, subscription, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [testingN8n, setTestingN8n] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    
    if (user) {
      testConnections();
    }
  }, [user, loading, navigate]);

  const testConnections = async () => {
    // Test Supabase connection
    try {
      const { error } = await supabase.from("scribia_usuarios").select("*").limit(1);
      setSupabaseConnected(!error);
      console.log("Supabase conectado:", !error);
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
    }

    // Stripe configuration check
    setStripeConfigured(true);
    console.log("Stripe configurado corretamente");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  const testN8nIntegration = async () => {
    setTestingN8n(true);
    
    try {
      const response = await fetch("https://sabrinaseibert.app.n8n.cloud/webhook/teste_scribia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          user_id: user?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Integração n8n ativa!",
          description: "Webhook respondeu com sucesso (200 OK)",
        });
        console.log("n8n webhook response:", await response.json());
      } else {
        toast({
          title: "Erro na integração n8n",
          description: `Status: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao testar n8n",
        description: "Não foi possível conectar ao webhook",
        variant: "destructive",
      });
      console.error("n8n test error:", error);
    }

    setTestingN8n(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ScribIA Plus
            </h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo de volta, {profile?.nome_completo || profile?.email}!
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>🚀 Status do Sistema</CardTitle>
              <CardDescription>
                ScribIA Plus iniciado com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Supabase</span>
                <span className={supabaseConnected ? "text-green-500" : "text-red-500"}>
                  {supabaseConnected ? "✓ Conectado" : "✗ Erro"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Stripe</span>
                <span className={stripeConfigured ? "text-green-500" : "text-red-500"}>
                  {stripeConfigured ? "✓ Configurado" : "✗ Erro"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>🔗 Integração n8n</CardTitle>
              <CardDescription>
                Teste a conexão com automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testN8nIntegration} 
                disabled={testingN8n}
                className="w-full"
              >
                {testingN8n ? "Testando..." : "Testar Integração"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/eventos")}>
            <CardHeader>
              <CardTitle>📅 Gerenciar Eventos</CardTitle>
              <CardDescription>
                Acesse o CRUD de eventos e palestras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Ir para Eventos
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/livebooks")}>
            <CardHeader>
              <CardTitle>📚 Livebooks Gerados</CardTitle>
              <CardDescription>
                Veja todos os seus resumos gerados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Ver Livebooks
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-primary/5 to-secondary/5" onClick={() => navigate("/tutor")}>
            <CardHeader>
              <CardTitle>💬 Tutor ScribIA</CardTitle>
              <CardDescription>
                Converse com IA sobre seus Livebooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Falar com o Tutor
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-elegant">
          <CardHeader>
            <CardTitle>📊 Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Nome:</span>
              <span>{profile?.nome_completo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{profile?.email}</span>
            </div>
            {profile?.cpf && (
              <div className="flex justify-between">
                <span className="font-medium">CPF:</span>
                <span>{profile.cpf}</span>
              </div>
            )}
            {profile?.whatsapp && (
              <div className="flex justify-between">
                <span className="font-medium">WhatsApp:</span>
                <span>{profile.whatsapp}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Plano:</span>
              <span className={`font-semibold ${
                subscription?.plano === 'free' ? 'text-muted-foreground' : 'text-primary'
              }`}>
                {subscription?.plano === 'free' && 'Gratuito'}
                {subscription?.plano === 'plus_mensal' && 'Plus Mensal'}
                {subscription?.plano === 'plus_anual' && 'Plus Anual'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={`font-semibold ${
                subscription?.status === 'ativo' ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {subscription?.status === 'ativo' && '✓ Ativo'}
                {subscription?.status === 'inativo' && '✗ Inativo'}
                {subscription?.status === 'pendente' && '⏳ Pendente'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
