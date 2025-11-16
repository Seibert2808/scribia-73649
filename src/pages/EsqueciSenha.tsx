import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requestPasswordReset } = useCustomAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await requestPasswordReset(email);

    if (!result.success) {
      toast({
        title: "Erro ao solicitar reset",
        description: result.error || "Erro interno do servidor",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Solicitação processada!",
        description: "Entre em contato com o suporte para obter o token de reset.",
      });
      setShowTokenInput(true);
    }

    setLoading(false);
  };

  const handleTokenSubmit = () => {
    if (resetToken.trim()) {
      navigate(`/redefinir-senha?token=${resetToken}`);
    } else {
      toast({
        title: "Token necessário",
        description: "Por favor, insira o token de reset fornecido pelo suporte.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit mb-2"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            {!showTokenInput 
              ? "Digite seu email para solicitar reset de senha"
              : "Digite o token fornecido pelo suporte"
            }
          </CardDescription>
        </CardHeader>
        
        {!showTokenInput ? (
          <form onSubmit={handlePasswordReset}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processando..." : "Solicitar reset de senha"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Lembrou sua senha?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Fazer login
                </a>
              </p>
            </CardFooter>
          </form>
        ) : (
          <div>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token de Reset</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Digite o token fornecido pelo suporte"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button onClick={handleTokenSubmit} className="w-full">
                Continuar para redefinir senha
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTokenInput(false)}
                className="w-full"
              >
                Voltar
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EsqueciSenha;
