import { useEffect, useState } from 'react';
import { configuracoesApi } from '@/services/api';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ConfiguracoesOrganizador() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useCustomAuth();
  const { toast } = useToast();

  // DADOS PESSOAIS
  const [dadosPessoais, setDadosPessoais] = useState({
    nome_completo: '',
    email_pessoal: '',
    telefone_pessoal: '',
    data_nascimento: '',
    cpf_pessoal: '',
    rg: ''
  });

  // DADOS EMPRESARIAIS
  const [dadosEmpresariais, setDadosEmpresariais] = useState({
    nome_empresa: '',
    cnpj: '',
    inscricao_estadual: '',
    razao_social: '',
    endereco_comercial: '',
    numero_endereco: '',
    complemento_endereco: '',
    bairro_endereco: '',
    cidade_comercial: '',
    estado_comercial: '',
    cep_comercial: '',
    telefone_comercial: '',
    email_comercial: '',
    website: '',
    logo_url: ''
  });

  // DADOS BANCÁRIOS
  const [dadosBancarios, setDadosBancarios] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo_conta: 'corrente' as 'corrente' | 'poupanca',
    titular: '',
    cpf_titular: '',
    pix: ''
  });

  // CONFIGURAÇÕES
  const [configuracoes, setConfiguracoes] = useState({
    notificacoes_email: true,
    notificacoes_whatsapp: true,
    relatorios_automaticos: true,
    compartilhar_dados_anonimos: false
  });

  // CARREGAR DADOS DO BACKEND AO MONTAR
  useEffect(() => {
    if (user) {
      loadConfiguracoes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadConfiguracoes = async () => {
    try {
      setLoading(true);

      const response = await configuracoesApi.get();
      const data = response.data;

      if (data) {
        setDadosPessoais({
          nome_completo: data.nome_completo || '',
          email_pessoal: data.email_pessoal || '',
          telefone_pessoal: data.telefone_pessoal || '',
          data_nascimento: data.data_nascimento || '',
          cpf_pessoal: data.cpf_pessoal || '',
          rg: data.rg || ''
        });

        setDadosEmpresariais({
          nome_empresa: data.nome_empresa || '',
          cnpj: data.cnpj || '',
          inscricao_estadual: data.inscricao_estadual || '',
          razao_social: data.razao_social || '',
          endereco_comercial: data.endereco_comercial || '',
          numero_endereco: data.numero_endereco || '',
          complemento_endereco: data.complemento_endereco || '',
          bairro_endereco: data.bairro_endereco || '',
          cidade_comercial: data.cidade_comercial || '',
          estado_comercial: data.estado_comercial || '',
          cep_comercial: data.cep_comercial || '',
          telefone_comercial: data.telefone_comercial || '',
          email_comercial: data.email_comercial || '',
          website: data.website || '',
          logo_url: data.logo_url || ''
        });

        setDadosBancarios({
          banco: data.banco || '',
          agencia: data.agencia || '',
          conta: data.conta || '',
          tipo_conta: (data.tipo_conta as 'corrente' | 'poupanca') || 'corrente',
          titular: data.titular || '',
          cpf_titular: data.cpf_titular || '',
          pix: data.pix || ''
        });

        setConfiguracoes({
          notificacoes_email: data.notificacoes_email ?? true,
          notificacoes_whatsapp: data.notificacoes_whatsapp ?? true,
          relatorios_automaticos: data.relatorios_automaticos ?? true,
          compartilhar_dados_anonimos: data.compartilhar_dados_anonimos ?? false
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      // Não mostrar erro se for 404 (configurações ainda não criadas)
      if (error.response?.status !== 404) {
        toast({
          title: 'Erro',
          description: error.response?.data?.message || 'Não foi possível carregar as configurações.',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const dadosCompletos = {
        nome_completo: dadosPessoais.nome_completo,
        email_pessoal: dadosPessoais.email_pessoal,
        telefone_pessoal: dadosPessoais.telefone_pessoal,
        data_nascimento: dadosPessoais.data_nascimento || null,
        cpf_pessoal: dadosPessoais.cpf_pessoal,
        rg: dadosPessoais.rg,
        nome_empresa: dadosEmpresariais.nome_empresa,
        cnpj: dadosEmpresariais.cnpj,
        inscricao_estadual: dadosEmpresariais.inscricao_estadual,
        razao_social: dadosEmpresariais.razao_social,
        endereco_comercial: dadosEmpresariais.endereco_comercial,
        numero_endereco: dadosEmpresariais.numero_endereco,
        complemento_endereco: dadosEmpresariais.complemento_endereco,
        bairro_endereco: dadosEmpresariais.bairro_endereco,
        cidade_comercial: dadosEmpresariais.cidade_comercial,
        estado_comercial: dadosEmpresariais.estado_comercial,
        cep_comercial: dadosEmpresariais.cep_comercial,
        telefone_comercial: dadosEmpresariais.telefone_comercial,
        email_comercial: dadosEmpresariais.email_comercial,
        website: dadosEmpresariais.website,
        logo_url: dadosEmpresariais.logo_url,
        banco: dadosBancarios.banco,
        agencia: dadosBancarios.agencia,
        conta: dadosBancarios.conta,
        tipo_conta: dadosBancarios.tipo_conta,
        titular: dadosBancarios.titular,
        cpf_titular: dadosBancarios.cpf_titular,
        pix: dadosBancarios.pix,
        notificacoes_email: configuracoes.notificacoes_email,
        notificacoes_whatsapp: configuracoes.notificacoes_whatsapp,
        relatorios_automaticos: configuracoes.relatorios_automaticos,
        compartilhar_dados_anonimos: configuracoes.compartilhar_dados_anonimos
      };

      await configuracoesApi.update(dadosCompletos);

      toast({
        title: 'Sucesso!',
        description: 'Configurações salvas com sucesso.'
      });

      await loadConfiguracoes();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Não foi possível salvar as configurações.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus dados pessoais e empresariais</p>
      </div>

      <Tabs defaultValue="pessoal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
          <TabsTrigger value="empresarial">Empresarial</TabsTrigger>
          <TabsTrigger value="bancario">Bancário</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        {/* ABA 1: DADOS PESSOAIS */}
        <TabsContent value="pessoal" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Informações Pessoais</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dadosPessoais.nome_completo}
                  onChange={(e) =>
                    setDadosPessoais({ ...dadosPessoais, nome_completo: e.target.value })
                  }
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Pessoal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dadosPessoais.email_pessoal}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, email_pessoal: e.target.value })
                    }
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={dadosPessoais.telefone_pessoal}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, telefone_pessoal: e.target.value })
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="datanascimento">Data de Nascimento</Label>
                  <Input
                    id="datanascimento"
                    type="date"
                    value={dadosPessoais.data_nascimento}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, data_nascimento: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={dadosPessoais.cpf_pessoal}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, cpf_pessoal: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={dadosPessoais.rg}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, rg: e.target.value })
                    }
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 2: DADOS EMPRESARIAIS */}
        <TabsContent value="empresarial" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Informações Empresariais</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeempresa">Nome da Empresa</Label>
                  <Input
                    id="nomeempresa"
                    value={dadosEmpresariais.nome_empresa}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, nome_empresa: e.target.value })
                    }
                    placeholder="Sua Empresa LTDA"
                  />
                </div>
                <div>
                  <Label htmlFor="razaosocial">Razão Social</Label>
                  <Input
                    id="razaosocial"
                    value={dadosEmpresariais.razao_social}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, razao_social: e.target.value })
                    }
                    placeholder="Sua Empresa S/A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={dadosEmpresariais.cnpj}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, cnpj: e.target.value })
                    }
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="inscricao">Inscrição Estadual</Label>
                  <Input
                    id="inscricao"
                    value={dadosEmpresariais.inscricao_estadual}
                    onChange={(e) =>
                      setDadosEmpresariais({
                        ...dadosEmpresariais,
                        inscricao_estadual: e.target.value
                      })
                    }
                    placeholder="000.000.000.000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço Comercial</Label>
                <Input
                  id="endereco"
                  value={dadosEmpresariais.endereco_comercial}
                  onChange={(e) =>
                    setDadosEmpresariais({ ...dadosEmpresariais, endereco_comercial: e.target.value })
                  }
                  placeholder="Rua/Avenida"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={dadosEmpresariais.numero_endereco}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, numero_endereco: e.target.value })
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={dadosEmpresariais.complemento_endereco}
                    onChange={(e) =>
                      setDadosEmpresariais({
                        ...dadosEmpresariais,
                        complemento_endereco: e.target.value
                      })
                    }
                    placeholder="Sala 101"
                  />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={dadosEmpresariais.bairro_endereco}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, bairro_endereco: e.target.value })
                    }
                    placeholder="Centro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={dadosEmpresariais.cidade_comercial}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, cidade_comercial: e.target.value })
                    }
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    maxLength={2}
                    value={dadosEmpresariais.estado_comercial}
                    onChange={(e) =>
                      setDadosEmpresariais({
                        ...dadosEmpresariais,
                        estado_comercial: e.target.value.toUpperCase()
                      })
                    }
                    placeholder="SP"
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={dadosEmpresariais.cep_comercial}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, cep_comercial: e.target.value })
                    }
                    placeholder="01310-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefonec">Telefone Comercial</Label>
                  <Input
                    id="telefonec"
                    value={dadosEmpresariais.telefone_comercial}
                    onChange={(e) =>
                      setDadosEmpresariais({
                        ...dadosEmpresariais,
                        telefone_comercial: e.target.value
                      })
                    }
                    placeholder="(11) 3000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="emailc">Email Comercial</Label>
                  <Input
                    id="emailc"
                    type="email"
                    value={dadosEmpresariais.email_comercial}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, email_comercial: e.target.value })
                    }
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={dadosEmpresariais.website}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, website: e.target.value })
                    }
                    placeholder="https://empresa.com"
                  />
                </div>
                <div>
                  <Label htmlFor="logo">URL da Logo</Label>
                  <Input
                    id="logo"
                    value={dadosEmpresariais.logo_url}
                    onChange={(e) =>
                      setDadosEmpresariais({ ...dadosEmpresariais, logo_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 3: DADOS BANCÁRIOS */}
        <TabsContent value="bancario" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Seus dados bancários são criptografados e seguros. Utilizamos encriptação de nível 
                empresarial.
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-6">Informações Bancárias</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    value={dadosBancarios.banco}
                    onChange={(e) =>
                      setDadosBancarios({ ...dadosBancarios, banco: e.target.value })
                    }
                    placeholder="Itaú, Bradesco, Santander..."
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Conta</Label>
                  <select
                    id="tipo"
                    value={dadosBancarios.tipo_conta}
                    onChange={(e) =>
                      setDadosBancarios({
                        ...dadosBancarios,
                        tipo_conta: e.target.value as 'corrente' | 'poupanca'
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="corrente">Corrente</option>
                    <option value="poupanca">Poupança</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencia">Agência</Label>
                  <Input
                    id="agencia"
                    value={dadosBancarios.agencia}
                    onChange={(e) =>
                      setDadosBancarios({ ...dadosBancarios, agencia: e.target.value })
                    }
                    placeholder="0000"
                  />
                </div>
                <div>
                  <Label htmlFor="conta">Conta</Label>
                  <Input
                    id="conta"
                    value={dadosBancarios.conta}
                    onChange={(e) =>
                      setDadosBancarios({ ...dadosBancarios, conta: e.target.value })
                    }
                    placeholder="000000-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titular">Titular da Conta</Label>
                  <Input
                    id="titular"
                    value={dadosBancarios.titular}
                    onChange={(e) =>
                      setDadosBancarios({ ...dadosBancarios, titular: e.target.value })
                    }
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="cpftitular">CPF do Titular</Label>
                  <Input
                    id="cpftitular"
                    value={dadosBancarios.cpf_titular}
                    onChange={(e) =>
                      setDadosBancarios({ ...dadosBancarios, cpf_titular: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pix">PIX (Chave PIX)</Label>
                <Input
                  id="pix"
                  value={dadosBancarios.pix}
                  onChange={(e) =>
                    setDadosBancarios({ ...dadosBancarios, pix: e.target.value })
                  }
                  placeholder="CPF, Email, Telefone ou Chave Aleatória"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA 4: NOTIFICAÇÕES */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Preferências de Notificação</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações e relatórios</p>
                </div>
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes_email}
                  onChange={(e) =>
                    setConfiguracoes({
                      ...configuracoes,
                      notificacoes_email: e.target.checked
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Notificações por WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Alertas importantes via WhatsApp</p>
                </div>
                <input
                  type="checkbox"
                  checked={configuracoes.notificacoes_whatsapp}
                  onChange={(e) =>
                    setConfiguracoes({
                      ...configuracoes,
                      notificacoes_whatsapp: e.target.checked
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Relatórios Automáticos</p>
                  <p className="text-sm text-muted-foreground">Gerar e enviar relatórios automáticos</p>
                </div>
                <input
                  type="checkbox"
                  checked={configuracoes.relatorios_automaticos}
                  onChange={(e) =>
                    setConfiguracoes({
                      ...configuracoes,
                      relatorios_automaticos: e.target.checked
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Compartilhar Dados Anônimos</p>
                  <p className="text-sm text-muted-foreground">Ajude-nos a melhorar (sem dados sensíveis)</p>
                </div>
                <input
                  type="checkbox"
                  checked={configuracoes.compartilhar_dados_anonimos}
                  onChange={(e) =>
                    setConfiguracoes({
                      ...configuracoes,
                      compartilhar_dados_anonimos: e.target.checked
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* BOTÃO SALVAR GLOBAL */}
      <div className="flex justify-end gap-3 mt-8 sticky bottom-0 bg-background/95 p-4 rounded-lg border border-border">
        <Button variant="outline" onClick={loadConfiguracoes}>
          Descartar
        </Button>
        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}