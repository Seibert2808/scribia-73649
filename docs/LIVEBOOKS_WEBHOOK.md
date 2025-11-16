# Integração de Livebooks - Webhook de Callback

## Visão Geral

Este documento descreve o fluxo completo de processamento de Livebooks no ScribIA Plus, desde o upload do áudio até a geração dos arquivos finais.

## Fluxo de Processamento

### 1. Upload de Áudio (Frontend)
- Usuário cria/edita palestra e faz upload de áudio
- Arquivo é armazenado no Supabase Storage: `scribia-audio/{user_id}/`
- Palestra é salva com `status = 'aguardando'`

### 2. Transcrição (Edge Function: `scribia-transcribe`)
- Edge function é chamada automaticamente após upload
- Utiliza OpenAI Whisper API para transcrever áudio
- Salva transcrição em: `scribia-audio/{user_id}/transcricoes/{palestra_id}.txt`
- Atualiza palestra: `status = 'processando'`, `transcricao_url = URL`
- Cria registro em `scribia_livebooks` com `status = 'processando'`
- Envia payload para webhook n8n correspondente

### 3. Geração de Livebook (n8n)
O webhook n8n recebe o seguinte payload:

```json
{
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@email.com"
  },
  "palestra": {
    "id": "uuid-da-palestra",
    "titulo": "Título da Palestra",
    "nivel": "junior|pleno|senior",
    "formato": "completo|compacto",
    "transcricao_url": "URL da transcrição",
    "slides_url": "URL dos slides (opcional)"
  }
}
```

### 4. Callback após Geração (n8n → Edge Function)

**IMPORTANTE:** Após processar e gerar o livebook, o n8n DEVE fazer um POST para:

```
https://apnfbdkerddhkkzqstmp.supabase.co/functions/v1/scribia-webhook-callback
```

Com o seguinte payload:

#### Em caso de sucesso:
```json
{
  "palestra_id": "uuid-da-palestra",
  "pdf_url": "URL do PDF gerado",
  "html_url": "URL do HTML gerado",
  "docx_url": "URL do DOCX gerado (opcional)",
  "summary_type": "junior_completo|junior_compacto|pleno_completo|pleno_compacto|senior_completo|senior_compacto",
  "tempo_processamento": 45.5
}
```

#### Em caso de erro:
```json
{
  "palestra_id": "uuid-da-palestra",
  "erro": "Descrição detalhada do erro ocorrido"
}
```

## Webhooks n8n Disponíveis

O sistema direciona para diferentes webhooks baseado no par (nível + formato):

| Nível | Formato | Webhook |
|-------|---------|---------|
| Júnior | Completo | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_junior_completo` |
| Júnior | Compacto | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_junior_compacto` |
| Pleno | Completo | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_pleno_completo` |
| Pleno | Compacto | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_pleno_compacto` |
| Sênior | Completo | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_senio_completo` |
| Sênior | Compacto | `https://sabrinaseibert.app.n8n.cloud/webhook/livebook_senio_compacto` |

## Estados do Sistema

### Status de Palestra
- `aguardando`: Palestra criada, aguardando processamento
- `transcrevendo`: Áudio sendo transcrito
- `processando`: Livebook sendo gerado
- `concluido`: Livebook gerado com sucesso
- `erro`: Erro no processamento

### Status de Livebook
- `aguardando`: Aguardando transcrição
- `transcrevendo`: Transcrição em andamento
- `processando`: Gerando livebook
- `concluido`: Livebook pronto
- `erro`: Erro na geração

## Monitoramento em Tempo Real

O frontend usa Supabase Realtime para atualizar automaticamente o status:

```typescript
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'scribia_livebooks',
      filter: `usuario_id=eq.${user.id}`,
    },
    () => {
      // Atualizar lista de livebooks
    }
  )
  .subscribe();
```

## Logs e Debugging

### Edge Function Logs
- **scribia-transcribe**: Logs de transcrição
- **scribia-webhook-callback**: Logs de callback do n8n

Acesse em: [Supabase Edge Functions Logs](https://supabase.com/dashboard/project/apnfbdkerddhkkzqstmp/functions)

### Campos de Debug
- `tempo_processamento`: Tempo em segundos para gerar o livebook
- `erro_log`: Mensagem de erro detalhada
- `criado_em` / `atualizado_em`: Timestamps para rastreamento

## Exemplo de Implementação n8n

```javascript
// Após gerar o livebook no n8n, fazer callback:

const callbackPayload = {
  palestra_id: "{{ $json.palestra.id }}",
  pdf_url: "{{ $json.generated_files.pdf }}",
  html_url: "{{ $json.generated_files.html }}",
  docx_url: "{{ $json.generated_files.docx }}",
  summary_type: "{{ $json.palestra.nivel }}_{{ $json.palestra.formato }}",
  tempo_processamento: "{{ $json.processing_time }}"
};

// POST para scribia-webhook-callback
await fetch('https://apnfbdkerddhkkzqstmp.supabase.co/functions/v1/scribia-webhook-callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(callbackPayload)
});
```

## Troubleshooting

### Livebook fica travado em "Processando"
- Verificar se n8n está fazendo o callback
- Checar logs da edge function `scribia-webhook-callback`
- Confirmar que o `palestra_id` está correto no callback

### Erro "OPENAI_API_KEY não configurada"
- Adicionar a chave no Supabase Secrets
- Acessar: Settings → Edge Functions → Add Secret

### Arquivos não aparecem no frontend
- Verificar se as URLs retornadas são acessíveis
- Confirmar que `scribia_livebooks.status = 'concluido'`
- Checar políticas de storage no Supabase
