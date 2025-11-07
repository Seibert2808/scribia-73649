# 🚀 ScribIA Plus

**Plataforma SaaS que transforma palestras e eventos em Livebooks personalizados com IA**

## 📋 Stack Tecnológica

- **Frontend:** React + Vite + TypeScript + TailwindCSS + Shadcn/UI
- **Backend:** Supabase (autenticação, banco de dados e storage)
- **Pagamentos:** Stripe (sandbox/produção)
- **Automação:** n8n (webhooks externos)
- **Deploy:** Lovable (automático)

---

## 🔧 Configuração Inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O projeto já está conectado ao Supabase. As credenciais estão configuradas em:
- `src/integrations/supabase/client.ts`

Para n8n, a URL do webhook é:
```
https://sabrinaseibert.app.n8n.cloud
```

### 3. Rodar o projeto localmente

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
src/
 ┣ components/
 ┃ ┣ auth/
 ┃ ┃ ┗ AuthGuard.tsx   # Proteção de rotas autenticadas
 ┃ ┣ sections/         # Seções da landing page
 ┃ ┗ ui/               # Componentes do Shadcn/UI
 ┣ pages/
 ┃ ┣ Index.tsx         # Landing page
 ┃ ┣ Login.tsx         # Login com email e senha
 ┃ ┣ Cadastro.tsx      # Registro completo (nome, CPF, email, WhatsApp)
 ┃ ┣ Dashboard.tsx     # Área autenticada (perfil + assinatura)
 ┃ ┗ TesteGratuito.tsx # Teste gratuito
 ┣ hooks/
 ┃ ┗ useAuth.ts        # Hook de autenticação e sessão
 ┣ integrations/
 ┃ ┗ supabase/         # Cliente e tipos do Supabase
 ┣ lib/                # Utilitários e configurações
 ┗ utils/              # Funções auxiliares
```

---

## 🔐 Funcionalidades Implementadas

### ✅ Fase 1 - Infraestrutura e Autenticação

#### Autenticação Completa
- [x] Sistema de cadastro com dados completos:
  - Nome completo
  - CPF
  - Email (único)
  - WhatsApp
  - Senha (gerenciada pelo Supabase Auth)
- [x] Login via email e senha
- [x] Proteção de rotas com AuthGuard
- [x] Hook personalizado `useAuth` para sessão
- [x] Sessão persistente (mantém login após reload)
- [x] Logout funcional
- [x] Criação automática de perfil e assinatura gratuita

#### Infraestrutura
- [x] Conexão com Supabase (autenticação + banco de dados)
- [x] Dashboard com informações do usuário
- [x] Teste de integração com n8n
- [x] Configuração do Stripe (sandbox)
- [x] Landing page responsiva
- [x] Design system com tema claro/escuro

### 🎯 Página Inicial

Acesse `/` para ver a landing page com:
- Hero section
- Problema e solução
- Como funciona
- Benefícios
- FAQ
- Formulário de teste gratuito

### 🔑 Autenticação

- **Cadastro:** `/cadastro` - Crie sua conta com dados completos
- **Login:** `/login` - Acesse com email e senha
- **Dashboard:** `/dashboard` - Área autenticada (protegida com AuthGuard)
  - Exibe perfil do usuário
  - Mostra status da assinatura
  - Testa integrações

### 🧪 Testar Integrações

No dashboard (`/dashboard`), você pode:

1. **Verificar status do Supabase** (conexão automática)
2. **Confirmar configuração do Stripe**
3. **Testar webhook do n8n** (botão "Testar Integração")

---

## 🔗 Links Oficiais

- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **n8n:** https://docs.n8n.io/
- **TailwindCSS:** https://tailwindcss.com/docs
- **Shadcn/UI:** https://ui.shadcn.com/
- **React Router:** https://reactrouter.com/
- **Lovable:** https://lovable.dev/

---

## 🎨 Design System

O projeto usa um design system completo com:

- **Cores:** Paleta personalizada com gradientes
- **Tipografia:** Sans-serif otimizada
- **Componentes:** Shadcn/UI totalmente customizável
- **Tema:** Suporte a light/dark mode
- **Animações:** Transições suaves e elegantes

Todas as cores são definidas em `src/index.css` usando HSL para máxima flexibilidade.

---

## 📊 Banco de Dados

### Tabelas do ScribIA Plus

#### 1. `scribia_usuarios` (Perfis de Usuários)
Armazena dados do perfil, linked com `auth.users`:
- `id`: uuid (PK, FK → auth.users.id)
- `nome_completo`: text (NOT NULL)
- `cpf`: text
- `email`: text (UNIQUE, NOT NULL)
- `whatsapp`: text
- `criado_em`, `updated_at`: timestamptz

**RLS Policies:**
- ✅ Usuários só veem seus próprios dados
- ✅ Usuários só podem atualizar seus próprios dados

#### 2. `scribia_assinaturas` (Planos e Assinaturas)
Gerencia planos e status:
- `id`: uuid (PK)
- `usuario_id`: uuid (FK → scribia_usuarios.id)
- `plano`: enum (free, plus_mensal, plus_anual)
- `status`: enum (ativo, inativo, pendente)
- `stripe_customer_id`: text
- `renovacao_em`: timestamptz
- `criado_em`: timestamptz

**RLS Policies:**
- ✅ Usuários só veem suas próprias assinaturas

#### 3. `scribia_client_free` (Leads do Teste Gratuito)
- `id_client_free`: bigint (PK)
- `name`, `email`, `whatsapp_e164`: text
- `created_at`: timestamptz

**RLS Policies:**
- ✅ Permite INSERT público (para teste gratuito)
- ✅ Bloqueia SELECT público (proteção de dados)

### Triggers e Automações

#### `handle_new_scribia_user()`
Executado automaticamente ao criar usuário via Supabase Auth:
- ✅ Cria perfil em `scribia_usuarios` com dados do signup
- ✅ Cria assinatura gratuita por padrão

#### `update_scribia_updated_at()`
Atualiza `updated_at` automaticamente ao modificar perfil

#### `notify_n8n_scribia_webhook()`
Envia dados para n8n ao inserir em `scribia_client_free`

---

## 🚀 Deploy

O projeto é automaticamente deployado via Lovable. Cada commit gera um novo deploy.

Para conectar um domínio customizado:
1. Acesse as configurações do projeto no Lovable
2. Vá em "Domains"
3. Adicione seu domínio e configure o DNS

---

## 🔒 Segurança

### Recomendações Implementadas

✅ Autenticação via Supabase Auth  
✅ RLS (Row Level Security) nas tabelas  
✅ Validação de entrada com Zod  
✅ CORS configurado nos Edge Functions  
✅ Proteção de rotas privadas

### Próximos Passos de Segurança

- [ ] Adicionar rate limiting no signup
- [ ] Implementar CAPTCHA no formulário
- [ ] Adicionar autenticação no webhook n8n
- [ ] Validação de telefone mais robusta

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

---

## 🤝 Suporte

Para dúvidas ou problemas:
- Documentação do Lovable: https://docs.lovable.dev
- Suporte Supabase: https://supabase.com/support

---

**Project URL**: https://lovable.dev/projects/fe2408e4-115e-4f28-a8cb-0f61d9e531d0

**Desenvolvido com ❤️ usando Lovable**
