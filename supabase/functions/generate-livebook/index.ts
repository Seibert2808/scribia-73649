import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper: System prompt baseado no perfil com instruções completas do ScribIA
function getSystemPrompt(nivel: string, tipoResumo: string): string {
  const extensao = tipoResumo === 'compacto' ? 'até 4.000 palavras' : '4.000 a 15.000 palavras';

  // Instruções específicas por perfil conforme documento
  const perfilInstrucoes: Record<string, string> = {
    'junior-completo': `
**PERFIL: Júnior Completo**
- Profissional iniciante em fase de aprendizado
- Extensão: 4.000 a 15.000 palavras
- Objetivo: Ensinar conceitos, histórias e caminhos relacionados ao tema. Contextualizar e motivar.

**INSTRUÇÕES:**
- Linguagem clara e acolhedora
- Explicar conceitos básicos
- Usar analogias e exemplos simples
- Estimular a aprendizagem contínua`,

    'junior-compacto': `
**PERFIL: Júnior Compacto**
- Iniciante que prefere conteúdo direto
- Extensão: até 4.000 palavras
- Objetivo: Entregar o essencial com clareza. Foco nos conceitos-chave, marcos históricos (se mencionados), pontos principais e inovações.

**INSTRUÇÕES:**
- Foco em tópicos e listas
- Evitar excesso de explicações
- Frases curtas, linguagem acessível`,

    'pleno-completo': `
**PERFIL: Pleno Completo**
- Profissional com experiência que busca aprofundar
- Extensão: 4.000 a 15.000 palavras
- Objetivo: Equilibrar conceitos e prática. Identificar o ponto alto ("clímax") da palestra e as principais inovações citadas.

**INSTRUÇÕES:**
- Linguagem fluida e profissional
- Contextualização de mercado
- Análise de problemas e soluções reais`,

    'pleno-compacto': `
**PERFIL: Pleno Compacto**
- Profissional experiente com pouco tempo
- Extensão: até 4.000 palavras
- Objetivo: Resumo direto com foco em aplicabilidade. Destaque o clímax da palestra.

**INSTRUÇÕES:**
- Listas objetivas
- Frases diretas e sem enrolação
- Pelo menos uma aplicação por tópico`,

    'senior-completo': `
**PERFIL: Sênior Completo**
- Profissional experiente com visão estratégica
- Extensão: 4.000 a 15.000 palavras
- Objetivo: Análise crítica, projeções e reflexões profundas. Explique as inovações, novas tecnologias, pesquisas, metodologias, termos técnicos, siglas e neologismos citados.

**INSTRUÇÕES:**
- Linguagem analítica e madura
- Correlações com tendências e impactos
- Aplicações estratégicas e provocativas`,

    'senior-compacto': `
**PERFIL: Sênior Compacto**
- Líder ou especialista com foco em síntese estratégica
- Extensão: até 4.000 palavras
- Objetivo: Entregar densidade e valor estratégico em pouco tempo. Foco no que foi inovador, decisivo ou diferenciado na palestra.

**INSTRUÇÕES:**
- Linguagem executiva e precisa
- Foco em decisões, impactos e implicações
- Destaque palavras-chave, tecnologias, siglas, medicamentos, termos específicos`
  };

  const perfilKey = `${nivel}-${tipoResumo}`;
  const instrucoesPerfil = perfilInstrucoes[perfilKey] || perfilInstrucoes['pleno-completo'];

  return `Você é a **ScribIA**, uma agente de IA que gera **resumos de palestras e conferências** adaptados ao **perfil de aprendizado do usuário** — chamados de **Livebooks**. O perfil foi previamente identificado.

${instrucoesPerfil}

---

## INSTRUÇÕES GERAIS

- Você receberá:
  - A transcrição da palestra
  - Metadados fornecidos pelo usuário
  - O perfil do usuário

- Você deve:
  - Gerar o conteúdo com base na **estrutura padrão** abaixo
  - **Basear-se exclusivamente na transcrição da palestra**
  - **Apenas para a seção "Sobre o Palestrante", você pode buscar informações na rede se necessário**
  - Ajustar a **profundidade, tom e estilo** de acordo com o perfil selecionado

---

## ESTRUTURA BASE DO LIVEBOOK

## METADADOS
**TÍTULO:** [título exato da palestra]  
**PALESTRANTE:** [nome completo]  
**CARGO/EMPRESA:** [cargo e empresa ou "Não mencionado"]  
**EVENTO/DATA:** [evento e data ou "Não mencionado"]

---

## RESUMO EXECUTIVO
Resumo entre 150–250 palavras. Explica o tema e os principais aprendizados.

---

## SOBRE O PALESTRANTE
Breve biografia em 50–80 palavras contextualizando o palestrante. Você pode buscar essas informações na rede se não estiverem disponíveis na transcrição. Pode colocar o link de redes sociais se houver.

---

## TÓPICOS PRINCIPAIS
Cada tópico deve conter:
- **Conceito:** explicação central
- **Pontos-chave:** bullets com os aprendizados extraídos
- **Aplicação:** como usar o conteúdo na prática

---

## DESTAQUES
> Citações marcantes (entre 1 e 5)

- Dados ou estatísticas relevantes, com contexto

---

## CONCLUSÕES
**Lições Aprendidas:** lições principais extraídas da palestra  
**Próximos Passos:** sugestões de ação com base no conteúdo  
**Recursos Mencionados:** autores, livros, ferramentas ou metodologias citadas

---

IMPORTANTE:
- Use markdown para formatação
- Seja fiel à transcrição fornecida
- Adapte a profundidade e linguagem ao perfil selecionado
- Mantenha a extensão recomendada: ${extensao}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcricao, perfil, metadados, palestraId, usuarioId } = await req.json();

    if (!transcricao || !perfil) {
      throw new Error('transcricao e perfil são obrigatórios');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    // Extrair nível e tipo (ex: 'junior-compacto' -> ['junior', 'compacto'])
    const [nivel, tipoResumo] = perfil.split('-');

    const transcriptionLength = transcricao.length;
    console.log('📚 Gerando livebook...');
    console.log('👤 Perfil:', nivel, '-', tipoResumo);
    console.log('📝 Tamanho transcrição:', transcriptionLength, 'caracteres');

    // ========== SELEÇÃO AUTOMÁTICA DE LLM ==========
    let model = 'gpt-4o';
    let apiUrl = 'https://api.openai.com/v1/chat/completions';
    let apiKey: string | undefined = OPENAI_API_KEY;

    // Gemini para transcrições longas (mais de 100k caracteres)
    if (transcriptionLength > 500000) {
      model = 'gemini-1.5-pro';
      apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
      apiKey = GEMINI_API_KEY;
      console.log('🤖 Transcrição muito longa (>500k chars), usando Gemini 1.5 Pro');
    } else if (transcriptionLength > 100000) {
      model = 'gemini-1.5-flash';
      apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      apiKey = GEMINI_API_KEY;
      console.log('🤖 Transcrição longa (>100k chars), usando Gemini 1.5 Flash');
    } else {
      console.log('🤖 Usando GPT-4o (transcrição <100k chars)');
    }

    if (!apiKey) {
      throw new Error(`API key não configurada para modelo: ${model}`);
    }

    // Montar prompts
    const systemPrompt = getSystemPrompt(nivel, tipoResumo);
    
    // Incluir metadados no prompt
    const metadadosTexto = `
## METADADOS FORNECIDOS
**TÍTULO:** ${metadados?.titulo || 'Não informado'}  
**PALESTRANTE:** ${metadados?.palestrante || 'Não informado'}
${metadados?.evento ? `**EVENTO/DATA:** ${metadados.evento}` : ''}
    `.trim();
    
    const userPrompt = `
${metadadosTexto}

---

Transcrição da palestra:
${transcricao}

Gere o Livebook seguindo a estrutura e instruções definidas no seu prompt de sistema. Inclua os metadados fornecidos acima no início do documento.
    `.trim();

    // ========== PREPARAR REQUEST BASEADO NO MODELO ==========
    let requestBody: any;
    let requestHeaders: any;

    if (model.startsWith('gemini')) {
      // Formato Gemini
      requestBody = {
        contents: [{
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 16000,
        }
      };
      requestHeaders = {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      };
    } else {
      // Formato OpenAI
      requestBody = {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 16000
      };
      requestHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
    }

    console.log(`🚀 Chamando ${model}...`);

    // Chamar LLM API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro ${model}:`, response.status, errorText);
      throw new Error(`Erro na geração do livebook com ${model}: ${response.status}`);
    }

    const data = await response.json();
    
    // ========== EXTRAIR RESPOSTA BASEADO NO MODELO ==========
    let livebook: string;
    if (model.startsWith('gemini')) {
      livebook = data.candidates[0].content.parts[0].text;
    } else {
      livebook = data.choices[0].message.content;
    }

    console.log('✅ Livebook gerado com sucesso');
    console.log('📊 Tamanho:', livebook.length, 'caracteres');

    // Salvar no banco de dados se palestraId e usuarioId foram fornecidos
    let livebookId = null;
    let pdfUrl: string | null = null;
    let txtUrl: string | null = null;
    if (palestraId && usuarioId) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Mapear perfil para enum tipo_resumo
      const tipoResumoEnum = `${nivel}_${tipoResumo}` as 'junior_compacto' | 'junior_completo' | 'pleno_compacto' | 'pleno_completo' | 'senior_compacto' | 'senior_completo';
      
      // Preparar data formatada
      const dataAtual = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // ========== 1. GERAR TXT ==========
      const livebookFormatado = `${'='.repeat(80)}
LIVEBOOK SCRIBIA
Documento gerado por Scribia - ${dataAtual}
${'='.repeat(80)}

${livebook}

${'='.repeat(80)}
Gerado por ScribIA - Sistema Inteligente de Resumos Personalizados
www.scribia.com.br
${'='.repeat(80)}`;

      const txtFileName = `livebook_${palestraId}_${Date.now()}.txt`;
      const { data: txtUploadData, error: txtUploadError } = await supabase
        .storage
        .from('livebooks')
        .upload(`${usuarioId}/${txtFileName}`, new Blob([livebookFormatado], { type: 'text/plain' }), {
          contentType: 'text/plain',
          upsert: false
        });

      if (txtUploadError) {
        console.error('⚠️ Erro ao fazer upload do TXT:', txtUploadError);
      } else {
        console.log('📄 TXT salvo:', txtUploadData.path);
      }

      txtUrl = txtUploadError ? null : supabase
        .storage
        .from('livebooks')
        .getPublicUrl(`${usuarioId}/${txtFileName}`).data.publicUrl;

      // ========== 2. GERAR PDF ==========
      console.log('📄 Gerando PDF formatado...');
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const primaryColor = rgb(0.42, 0.45, 0.65); // #6B74A5 - cor do logo
      const accentColor = rgb(0.53, 0.70, 0.86); // #87B3DB - azul claro
      const textColor = rgb(0.2, 0.2, 0.2);
      
      let currentPage = pdfDoc.addPage([595, 842]); // A4
      let yPosition = 770;
      const margin = 50;
      const maxWidth = 495;
      const lineHeight = 16;
      
      // Helper para adicionar nova página se necessário
      const checkAndAddPage = () => {
        if (yPosition < 100) {
          currentPage = pdfDoc.addPage([595, 842]);
          yPosition = 770;
          return true;
        }
        return false;
      };
      
      // Helper para remover caracteres especiais que não são suportados pelo WinAnsi
      const sanitizeText = (text: string): string => {
        return text
          .replace(/[π]/g, 'pi')
          .replace(/[α]/g, 'alpha')
          .replace(/[β]/g, 'beta')
          .replace(/[γ]/g, 'gamma')
          .replace(/[δ]/g, 'delta')
          .replace(/[ε]/g, 'epsilon')
          .replace(/[θ]/g, 'theta')
          .replace(/[λ]/g, 'lambda')
          .replace(/[μ]/g, 'mu')
          .replace(/[σ]/g, 'sigma')
          .replace(/[Σ]/g, 'Sigma')
          .replace(/[∑]/g, 'Sum')
          .replace(/[∫]/g, 'Integral')
          .replace(/[≈]/g, '~')
          .replace(/[≠]/g, '!=')
          .replace(/[≤]/g, '<=')
          .replace(/[≥]/g, '>=')
          .replace(/[°]/g, ' graus')
          .replace(/[±]/g, '+/-')
          .replace(/[×]/g, 'x')
          .replace(/[÷]/g, '/')
          .replace(/[√]/g, 'raiz')
          .replace(/[∞]/g, 'infinito')
          .replace(/[•]/g, '- ')
          .replace(/[→]/g, '->')
          .replace(/[←]/g, '<-')
          .replace(/[↑]/g, '^')
          .replace(/[↓]/g, 'v')
          .replace(/[™]/g, 'TM')
          .replace(/[®]/g, '(R)')
          .replace(/[©]/g, '(C)')
          .replace(/[€]/g, 'EUR')
          .replace(/[£]/g, 'GBP')
          .replace(/[¥]/g, 'YEN')
          .replace(/[…]/g, '...')
          .replace(/[–]/g, '-')
          .replace(/[—]/g, '-')
          .replace(/['']/g, "'")
          .replace(/[""]/g, '"')
          .replace(/[\u0080-\uFFFF]/g, '?'); // Remove outros caracteres não-ASCII restantes
      };
      
      // Helper para escrever texto com quebra de linha
      const writeText = (text: string, fontSize: number, useFont: any, color: any, isBold: boolean = false) => {
        const sanitizedText = sanitizeText(text);
        const words = sanitizedText.split(' ');
        let line = '';
        
        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word;
          const textWidth = useFont.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && line) {
            currentPage.drawText(line, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: useFont,
              color: color
            });
            yPosition -= lineHeight;
            checkAndAddPage();
            line = word;
          } else {
            line = testLine;
          }
        }
        
        if (line) {
          currentPage.drawText(line, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: useFont,
            color: color
          });
          yPosition -= lineHeight;
          checkAndAddPage();
        }
      };
      
      // ========== CABEÇALHO ==========
      // Logo ScribIA (texto estilizado)
      currentPage.drawText('SCRIBIA', {
        x: margin,
        y: yPosition,
        size: 28,
        font: fontBold,
        color: primaryColor
      });
      
      yPosition -= 25;
      currentPage.drawText('Sistema Inteligente de Resumos Personalizados', {
        x: margin,
        y: yPosition,
        size: 10,
        font: font,
        color: accentColor
      });
      
      yPosition -= 15;
      // Linha decorativa
      currentPage.drawLine({
        start: { x: margin, y: yPosition },
        end: { x: 545, y: yPosition },
        thickness: 2,
        color: primaryColor
      });
      
      yPosition -= 30;
      
      // Data de geração
      currentPage.drawText(`Gerado em: ${dataAtual}`, {
        x: margin,
        y: yPosition,
        size: 9,
        font: font,
        color: textColor
      });
      
      yPosition -= 10;
      currentPage.drawText(`Perfil: ${nivel.toUpperCase()} - ${tipoResumo.toUpperCase()}`, {
        x: margin,
        y: yPosition,
        size: 9,
        font: font,
        color: textColor
      });
      
      yPosition -= 40;
      
      // ========== PROCESSAR CONTEÚDO ==========
      const lines = livebook.split('\n');
      
      for (const line of lines) {
        // Títulos principais (##)
        if (line.startsWith('## ')) {
          yPosition -= 10;
          checkAndAddPage();
          const titulo = line.replace('## ', '').trim();
          writeText(titulo, 16, fontBold, primaryColor);
          yPosition -= 10;
        }
        // Subtítulos (###)
        else if (line.startsWith('### ')) {
          yPosition -= 8;
          checkAndAddPage();
          const subtitulo = line.replace('### ', '').trim();
          writeText(subtitulo, 13, fontBold, textColor);
          yPosition -= 5;
        }
        // Negrito (**texto**)
        else if (line.includes('**')) {
          const texto = line.replace(/\*\*/g, '');
          writeText(texto, 11, fontBold, textColor);
        }
        // Citações (> )
        else if (line.startsWith('> ')) {
          yPosition -= 5;
          currentPage.drawRectangle({
            x: margin - 5,
            y: yPosition - 5,
            width: 3,
            height: lineHeight + 5,
            color: accentColor
          });
          const citacao = line.replace('> ', '').trim();
          writeText(citacao, 10, font, textColor);
          yPosition -= 5;
        }
        // Listas (-)
        else if (line.trim().startsWith('- ')) {
          const item = line.trim().replace('- ', '');
          currentPage.drawText('•', {
            x: margin + 10,
            y: yPosition,
            size: 11,
            font: font,
            color: primaryColor
          });
          const itemWords = item.split(' ');
          let itemLine = '';
          let xOffset = margin + 25;
          
          for (const word of itemWords) {
            const testLine = itemLine + (itemLine ? ' ' : '') + word;
            const textWidth = font.widthOfTextAtSize(testLine, 11);
            
            if (textWidth > maxWidth - 25 && itemLine) {
              currentPage.drawText(itemLine, {
                x: xOffset,
                y: yPosition,
                size: 11,
                font: font,
                color: textColor
              });
              yPosition -= lineHeight;
              checkAndAddPage();
              itemLine = word;
              xOffset = margin + 25;
            } else {
              itemLine = testLine;
            }
          }
          
          if (itemLine) {
            currentPage.drawText(itemLine, {
              x: xOffset,
              y: yPosition,
              size: 11,
              font: font,
              color: textColor
            });
            yPosition -= lineHeight;
            checkAndAddPage();
          }
        }
        // Linhas separadoras (---)
        else if (line.trim() === '---') {
          yPosition -= 10;
          currentPage.drawLine({
            start: { x: margin, y: yPosition },
            end: { x: 545, y: yPosition },
            thickness: 1,
            color: accentColor,
            opacity: 0.5
          });
          yPosition -= 15;
          checkAndAddPage();
        }
        // Linha vazia
        else if (line.trim() === '') {
          yPosition -= 8;
          checkAndAddPage();
        }
        // Texto normal
        else if (line.trim()) {
          writeText(line.trim(), 11, font, textColor);
        }
      }
      
      // ========== RODAPÉ ==========
      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        page.drawLine({
          start: { x: margin, y: 50 },
          end: { x: 545, y: 50 },
          thickness: 1,
          color: primaryColor
        });
        
        page.drawText('www.scribia.com.br', {
          x: margin,
          y: 35,
          size: 9,
          font: font,
          color: accentColor
        });
        
        page.drawText(`Página ${index + 1} de ${pages.length}`, {
          x: 500,
          y: 35,
          size: 9,
          font: font,
          color: textColor
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      console.log('✅ PDF gerado:', pdfBytes.length, 'bytes');
      
      // Salvar PDF no Storage
      const pdfFileName = `livebook_${palestraId}_${Date.now()}.pdf`;
      const pdfBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
      const { data: pdfUploadData, error: pdfUploadError } = await supabase
        .storage
        .from('livebooks')
        .upload(`${usuarioId}/${pdfFileName}`, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (pdfUploadError) {
        console.error('⚠️ Erro ao fazer upload do PDF:', pdfUploadError);
      } else {
        console.log('📄 PDF salvo:', pdfUploadData.path);
      }

      pdfUrl = pdfUploadError ? null : supabase
        .storage
        .from('livebooks')
        .getPublicUrl(`${usuarioId}/${pdfFileName}`).data.publicUrl;

      // ========== 3. ATUALIZAR LIVEBOOK NO BANCO ==========
      // Buscar o livebook existente criado pela função scribia-transcribe
      const { data: existingLivebook, error: fetchError } = await supabase
        .from('scribia_livebooks')
        .select('id')
        .eq('palestra_id', palestraId)
        .eq('usuario_id', usuarioId)
        .order('criado_em', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('⚠️ Erro ao buscar livebook:', fetchError);
      }

      if (existingLivebook) {
        // Atualizar livebook existente
        console.log('📝 Atualizando livebook existente:', existingLivebook.id);
        const { error: updateError } = await supabase
          .from('scribia_livebooks')
          .update({
            status: 'concluido',
            pdf_url: pdfUrl,
            docx_url: txtUrl,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', existingLivebook.id);

        if (updateError) {
          console.error('⚠️ Erro ao atualizar livebook:', updateError);
        } else {
          livebookId = existingLivebook.id;
          console.log('💾 Livebook atualizado no banco:', livebookId);
        }
      } else {
        // Criar novo livebook se não existir
        console.log('📝 Criando novo livebook...');
        const { data: livebookData, error: insertError } = await supabase
          .from('scribia_livebooks')
          .insert({
            palestra_id: palestraId,
            usuario_id: usuarioId,
            tipo_resumo: tipoResumoEnum,
            status: 'concluido',
            pdf_url: pdfUrl,
            docx_url: txtUrl,
          })
          .select()
          .single();

        if (insertError) {
          console.error('⚠️ Erro ao salvar livebook no banco:', insertError);
        } else {
          livebookId = livebookData.id;
          console.log('💾 Livebook salvo no banco:', livebookId);
        }
      }

      // Atualizar status da palestra para "concluido"
      const { error: palestraUpdateError } = await supabase
        .from('scribia_palestras')
        .update({
          status: 'concluido',
          atualizado_em: new Date().toISOString()
        })
        .eq('id', palestraId)
        .eq('usuario_id', usuarioId);

      if (palestraUpdateError) {
        console.error('⚠️ Erro ao atualizar status da palestra:', palestraUpdateError);
      } else {
        console.log('✅ Status da palestra atualizado para "concluido"');
      }
    }

    return new Response(
      JSON.stringify({ 
        livebook, 
        perfil, 
        metadados,
        livebookId,
        pdfUrl: pdfUrl || null,
        txtUrl: txtUrl || null,
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error: any) {
    console.error('❌ Erro ao gerar livebook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido', success: false }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
