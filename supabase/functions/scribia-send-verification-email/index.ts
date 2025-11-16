import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  nome: string;
  token: string;
  app_url?: string; // URL da aplicação para gerar o link correto
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nome, token, app_url }: EmailRequest = await req.json();

    console.log(`📧 Iniciando envio de email de verificação para: ${email}`);

    if (!email || !nome || !token) {
      throw new Error('Email, nome e token são obrigatórios');
    }

    // Use app_url from request or fallback to APP_URL env var
    const baseUrl = app_url || Deno.env.get('APP_URL') || 'https://lovable.dev';
    const verificationLink = `${baseUrl}/verificar-email?token=${token}`;
    
    console.log(`🔗 Link de verificação gerado: ${verificationLink}`);

    // HTML email template
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verificação de Email - ScribIA</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #6366f1; margin: 0;">🎙️ ScribIA</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
      <h2 style="color: #1f2937; margin-top: 0;">Olá, ${nome}!</h2>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Obrigado por se cadastrar no <strong>ScribIA</strong>! 🎉
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Para ativar sua conta e começar a transformar suas palestras em livebooks incríveis, 
        clique no botão abaixo:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background: #6366f1; color: white; padding: 15px 40px; 
                  text-decoration: none; border-radius: 8px; font-weight: bold;
                  display: inline-block;">
          ✅ Verificar Meu Email
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Ou copie e cole este link no seu navegador:<br>
        <a href="${verificationLink}" style="color: #6366f1; word-break: break-all;">
          ${verificationLink}
        </a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #9ca3af; font-size: 12px;">
        Se você não se cadastrou no ScribIA, ignore este email.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
      <p>© 2025 ScribIA - Transformando Palestras em Conhecimento</p>
    </div>
  </div>
</body>
</html>`;

    // Send email using Resend
    const { error: resendError } = await resend.emails.send({
      from: 'ScribIA <noreply@scribia.com.br>',
      to: [email],
      subject: '✅ Verifique seu email - ScribIA',
      html: htmlContent,
    });

    if (resendError) {
      throw resendError;
    }

    console.log(`✅ Email enviado com sucesso para ${email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado com sucesso'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Erro ao enviar email de verificação:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao enviar email'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
