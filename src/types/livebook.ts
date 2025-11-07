export type TipoResumo = 
  | 'junior_completo'
  | 'junior_compacto'
  | 'pleno_completo'
  | 'pleno_compacto'
  | 'senior_completo'
  | 'senior_compacto';

export type StatusLivebook = 
  | 'aguardando'
  | 'transcrevendo'
  | 'processando'
  | 'concluido'
  | 'erro';

export interface Livebook {
  id: string;
  palestra_id: string;
  usuario_id: string;
  tipo_resumo: TipoResumo;
  pdf_url: string | null;
  html_url: string | null;
  docx_url: string | null;
  status: StatusLivebook;
  tempo_processamento: number | null;
  erro_log: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface LivebookWithPalestra extends Livebook {
  palestra: {
    titulo: string;
    nivel_escolhido: string | null;
    formato_escolhido: string | null;
  };
}

export const STATUS_LABELS: Record<StatusLivebook, string> = {
  aguardando: 'Aguardando',
  transcrevendo: 'Transcrevendo',
  processando: 'Processando',
  concluido: 'Concluído',
  erro: 'Erro',
};

export const STATUS_COLORS: Record<StatusLivebook, string> = {
  aguardando: 'bg-muted text-muted-foreground',
  transcrevendo: 'bg-blue-500 text-white',
  processando: 'bg-yellow-500 text-white',
  concluido: 'bg-green-500 text-white',
  erro: 'bg-destructive text-destructive-foreground',
};

export const TIPO_RESUMO_LABELS: Record<TipoResumo, string> = {
  junior_completo: 'Júnior - Completo',
  junior_compacto: 'Júnior - Compacto',
  pleno_completo: 'Pleno - Completo',
  pleno_compacto: 'Pleno - Compacto',
  senior_completo: 'Sênior - Completo',
  senior_compacto: 'Sênior - Compacto',
};
