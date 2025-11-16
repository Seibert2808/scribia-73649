import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('🔍 VerificarEmail: Iniciando processo de verificação');
      
      const token = searchParams.get('token');
      console.log('🎫 Token recebido:', token ? `${token.substring(0, 20)}...` : 'NULL');

      if (!token) {
        console.error('❌ Token não encontrado na URL');
        setStatus('error');
        setMessage('Token de verificação não encontrado.');
        return;
      }

      try {
        console.log('📞 Chamando supabase.rpc("scribia_verify_email")...');
        
        const { data, error } = await supabase.rpc('scribia_verify_email', {
          p_token: token
        });

        console.log('📦 Resposta da função:', { data, error });

        if (error) {
          console.error('❌ Erro detalhado:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setStatus('error');
          setMessage(`Erro: ${error.message || 'Erro ao verificar email. O token pode ter expirado.'}`);
          return;
        }

        const result = data as { success: boolean; error?: string };
        console.log('✅ Resultado parseado:', result);

        if (result?.success) {
          console.log('🎉 Verificação concluída com sucesso!');
          setStatus('success');
          setMessage('Email verificado com sucesso! Você já pode fazer login.');
        } else {
          console.error('⚠️ Verificação falhou:', result?.error);
          setStatus('error');
          setMessage(result?.error || 'Não foi possível verificar o email.');
        }
      } catch (err) {
        console.error('💥 Erro interno:', err);
        setStatus('error');
        setMessage('Erro interno ao processar verificação.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verificando seu email...'}
            {status === 'success' && 'Email Verificado!'}
            {status === 'error' && 'Erro na Verificação'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <Button 
              className="w-full" 
              onClick={() => navigate('/selecionar-tipo-conta')}
            >
              Continuar
            </Button>
          )}
          {status === 'error' && (
            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/cadastro')}
              >
                Criar Nova Conta
              </Button>
              <Button 
                className="w-full" 
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Voltar para Login
              </Button>
            </div>
          )}
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground text-center">
              Aguarde enquanto verificamos seu email...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
