// Cliente Supabase isolado apenas para o projeto ScribIA
// Este cliente restringe o acesso apenas às tabelas necessárias do ScribIA

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://apnfbdkerddhkkzqstmp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmZiZGtlcmRkaGtrenFzdG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODg2NTUsImV4cCI6MjA3MDA2NDY1NX0.CVcB4Rr8KD0xE-70DcLH4ezuyPuscoulIrQpt2lY3D4";

// Tipos específicos do ScribIA para isolamento completo
export interface ScribiaClientFree {
  id_client_free?: number;
  name: string | null;
  email: string | null;
  whatsapp_e164: string | null;
  created_at?: string;
}

// Cliente Supabase com configuração específica para ScribIA
export const scribiaClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Função helper para inserir dados de trial gratuito
export const insertFreeTrialClient = async (data: {
  nome_completo: string;
  email: string;
  whatsapp: string;
}) => {
  const { data: result, error } = await scribiaClient.functions.invoke('scribia-free-signup', {
    body: {
      nome_completo: data.nome_completo,
      email: data.email,
      whatsapp: data.whatsapp,
    }
  });

  return { data: result, error };
};

// Função helper para validar se um email já foi cadastrado (para uso futuro)
export const checkEmailExists = async (email: string) => {
  const { data, error } = await scribiaClient
    .from('scribia_client_free')
    .select('email')
    .eq('email', email)
    .single();

  return { exists: !!data, error };
};