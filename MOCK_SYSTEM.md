# Sistema de Mock - ScribIA Plus

## 🎭 Como Usar o Mock

O sistema de mock permite navegar pela aplicação sem necessidade de backend ativo.

## 📧 Credenciais de Acesso

Use os seguintes emails na tela de login (qualquer senha funciona):

### 1. Organizador de Evento
- **Email:** `organizador_evento`
- **Senha:** qualquer
- **Redireciona para:** `/organizador/dashboard`
- **Funcionalidades:** Gerenciar eventos, palestras e relatórios

### 2. Patrocinador
- **Email:** `patrocinador_evento`
- **Senha:** qualquer
- **Redireciona para:** `/dashboard/patrocinador`
- **Funcionalidades:** Métricas de ROI e visibilidade

### 3. Palestrante/Influencer
- **Email:** `palestrante_influencer`
- **Senha:** qualquer
- **Redireciona para:** `/dashboard/palestrante`
- **Funcionalidades:** Gerenciar palestras e analytics

### 4. Participante de Evento
- **Email:** `participante_evento`
- **Senha:** qualquer
- **Redireciona para:** `/dashboard`
- **Funcionalidades:** Acessar livebooks de eventos

### 5. Usuário Individual
- **Email:** `usuario_individual`
- **Senha:** qualquer
- **Redireciona para:** `/dashboard`
- **Funcionalidades:** Criar livebooks próprios

## 🗄️ Dados Mockados

### Eventos
- **Congresso de Tecnologia 2024**
  - Data: 15-17/03/2024
  - Local: São Paulo Convention Center
  - 1500 participantes, 45 palestras

- **Summit de Inovação**
  - Data: 20-21/04/2024
  - Local: Rio de Janeiro
  - 800 participantes, 30 palestras

### Palestras
- **O Futuro da IA** - Dr. João Silva
- **Blockchain e Web3** - Maria Santos

### Livebooks
- Livebook gerado para "O Futuro da IA"

## 🔧 Implementação Técnica

### Arquivos Criados

1. **`src/lib/mockAuth.ts`**
   - Sistema de autenticação mock
   - Dados mockados (eventos, palestras, livebooks)
   - Funções de login/logout mock

2. **`src/hooks/useMockData.ts`**
   - Hook para acessar dados mockados
   - Funções helper para filtrar dados

### Arquivos Modificados

1. **`src/pages/Login.tsx`**
   - Detecta emails de perfil mock
   - Redireciona automaticamente para dashboard correto

2. **`src/components/auth/AuthGuard.tsx`**
   - Verifica sessão mock antes de redirecionar para login
   - Permite acesso com sessão mock ativa

## 💡 Como Usar nos Componentes

```typescript
import { useMockData } from '@/hooks/useMockData';

function MeuComponente() {
  const { isMockMode, getEventos, getCurrentUser } = useMockData();
  
  if (isMockMode) {
    const eventos = getEventos();
    const user = getCurrentUser();
    // Use os dados mockados
  }
  
  // Ou faça chamada real ao Supabase
}
```

## 🚀 Testando

1. Inicie a aplicação: `npm run dev`
2. Acesse: `http://localhost:5173/login`
3. Digite um dos emails de perfil (ex: `organizador_evento`)
4. Digite qualquer senha
5. Será redirecionado para o dashboard correspondente

## 🔄 Logout

O logout limpa a sessão mock automaticamente. Basta fazer logout normalmente pela interface.

## ⚠️ Notas Importantes

- O mock é apenas para desenvolvimento/demonstração
- Dados são armazenados no localStorage
- Sessão expira em 1 hora
- Não valida senha (aceita qualquer valor)
- Não faz chamadas reais ao Supabase quando em modo mock
