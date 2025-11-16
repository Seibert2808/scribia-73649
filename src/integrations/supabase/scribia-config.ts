// Configuração do projeto ScribIA - apenas recursos necessários
// Este arquivo documenta e centraliza todas as configurações específicas do ScribIA

export const SCRIBIA_CONFIG = {
  // Identificação do projeto
  project: "ScribIA",
  description: "Sistema inteligente de processamento de áudio e texto para congressos médicos",
  
  // Tabelas utilizadas pelo ScribIA
  tables: [
    "scribia_client_free"
  ],
  
  // Funcionalidades ativas
  features: {
    freeTrialSignup: true,
    pricingPlans: true,
    emailValidation: true,
    whatsappFormatting: true,
  },
  
  // Configurações de redirecionamento
  redirects: {
    afterFreeTrial: "https://scribia.app.br"
  },
  
  // Validações
  validation: {
    whatsapp: {
      minLength: 10,
      maxLength: 11
    },
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// Tipos derivados da configuração
export type ScribiaTable = typeof SCRIBIA_CONFIG.tables[number];
export type ScribiaFeature = keyof typeof SCRIBIA_CONFIG.features;