import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { toast } from "sonner";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useCustomAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }
    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = await signup({
        nome_completo: formData.nome_completo,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf || undefined,
        whatsapp: formData.whatsapp || undefined,
      });

      if (result.success) {
        toast.success("Cadastro realizado com sucesso! 📧", {
          description: "Verifique seu email para ativar sua conta.",
        });
        setTimeout(() => {
          navigate("/login", { state: { message: "Verifique seu email antes de fazer login" } });
        }, 2000);
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Voltar para a Home</Link>
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta na ScribIA</CardTitle>
            <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input id="nome_completo" name="nome_completo" type="text" placeholder="Seu nome completo" value={formData.nome_completo} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (opcional)</Label>
                <Input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                <Input id="whatsapp" name="whatsapp" type="text" placeholder="(11) 99999-9999" value={formData.whatsapp} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <PasswordInput id="senha" name="senha" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <PasswordInput id="confirmarSenha" name="confirmarSenha" placeholder="Digite a senha novamente" value={formData.confirmarSenha} onChange={handleChange} required />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando conta..." : "Criar Conta"}</Button>
            </form>

            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Faça login</Link></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
