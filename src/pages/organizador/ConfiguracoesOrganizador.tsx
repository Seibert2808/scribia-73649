import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building, 
  CreditCard, 
  Upload,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ConfiguracoesOrganizador = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pessoal');

  // Mock data - em produção viria do Supabase
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: 'Dra. Sabrina Seibert',
    email: 'sabrina@scribia.com.br',
    telefone: '+55 11 99999-9999',
    whatsapp: '+55 11 99999-9999',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    data_nascimento: '1985-05-15',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    pais: 'Brasil'
  });

  const [dadosEmpresariais, setDadosEmpresariais] = useState({
    nome_empresa: 'ScribIA Plus Eventos',
    cnpj: '12.345.678/0001-90',
    inscricao_estadual: '123.456.789.123',
    razao_social: 'ScribIA Plus Eventos Ltda',
    endereco_comercial: 'Av. Paulista, 1000',
    cidade_comercial: 'São Paulo',
    estado_comercial: 'SP',
    cep_comercial: '01310-100',
    telefone_comercial: '+55 11 3333-3333',
    email_comercial: 'contato@scribia.com.br',
    website: 'https://scribia.com.br'
  });

  const [dadosBancarios, setDadosBancarios] = useState({
    banco: '341',
    agencia: '1234',
    conta: '12345-6',
    tipo_conta: 'corrente',
    titular: 'Dra. Sabrina Seibert',
    cpf_titular: '123.456.789-00',
    pix: 'sabrina@scribia.com.br'
  });

  const [configuracoes, setConfiguracoes] = useState({
    notificacoes_email: true,
    notificacoes_whatsapp: true,
    relatorios_automaticos: true,
    compartilhar_dados_anonimos: false,
    tema_escuro: false,
    idioma: 'pt-BR'
  });

  const bancos = [
    { codigo: '341', nome: 'Itaú' },
    { codigo: '237', nome: 'Bradesco' },
    { codigo: '001', nome: 'Banco do Brasil' },
    { codigo: '104', nome: 'Caixa Econômica' },
    { codigo: '033', nome: 'Santander' },
    { codigo: '260', nome: 'Nu Pagamentos' },
    { codigo: '077', nome: 'Inter' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria feita a chamada para o Supabase
    }, 2000);
  };

  const handleUploadLogo = () => {
    // Implementar upload de logo
    console.log('Upload de logo');
  };

  const tabs = [
    { id: 'pessoal', label: 'Dados Pessoais', icon: User },
    { id: 'empresarial', label: 'Dados Empresariais', icon: Building },
    { id: 'bancario', label: 'Dados Bancários', icon: CreditCard },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e empresariais</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      {activeTab === 'pessoal' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dadosPessoais.nome}
                  onChange={(e) => setDadosPessoais({...dadosPessoais, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={dadosPessoais.email}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefone"
                    className="pl-10"
                    value={dadosPessoais.telefone}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, telefone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsapp"
                    className="pl-10"
                    value={dadosPessoais.whatsapp}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, whatsapp: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={dadosPessoais.cpf}
                  onChange={(e) => setDadosPessoais({...dadosPessoais, cpf: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={dadosPessoais.rg}
                  onChange={(e) => setDadosPessoais({...dadosPessoais, rg: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={dadosPessoais.endereco}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, endereco: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={dadosPessoais.cep}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, cep: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={dadosPessoais.cidade}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, cidade: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={dadosPessoais.estado}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, estado: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    value={dadosPessoais.pais}
                    onChange={(e) => setDadosPessoais({...dadosPessoais, pais: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados Empresariais */}
      {activeTab === 'empresarial' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Dados Empresariais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo da Empresa */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Logo da Empresa
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline" onClick={handleUploadLogo}>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                <Input
                  id="nome_empresa"
                  value={dadosEmpresariais.nome_empresa}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, nome_empresa: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input
                  id="razao_social"
                  value={dadosEmpresariais.razao_social}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, razao_social: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={dadosEmpresariais.cnpj}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, cnpj: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={dadosEmpresariais.inscricao_estadual}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, inscricao_estadual: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone_comercial">Telefone Comercial</Label>
                <Input
                  id="telefone_comercial"
                  value={dadosEmpresariais.telefone_comercial}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, telefone_comercial: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_comercial">E-mail Comercial</Label>
                <Input
                  id="email_comercial"
                  type="email"
                  value={dadosEmpresariais.email_comercial}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, email_comercial: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={dadosEmpresariais.website}
                  onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, website: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Endereço Comercial</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="endereco_comercial">Endereço</Label>
                  <Input
                    id="endereco_comercial"
                    value={dadosEmpresariais.endereco_comercial}
                    onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, endereco_comercial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep_comercial">CEP</Label>
                  <Input
                    id="cep_comercial"
                    value={dadosEmpresariais.cep_comercial}
                    onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, cep_comercial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade_comercial">Cidade</Label>
                  <Input
                    id="cidade_comercial"
                    value={dadosEmpresariais.cidade_comercial}
                    onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, cidade_comercial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado_comercial">Estado</Label>
                  <Input
                    id="estado_comercial"
                    value={dadosEmpresariais.estado_comercial}
                    onChange={(e) => setDadosEmpresariais({...dadosEmpresariais, estado_comercial: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados Bancários */}
      {activeTab === 'bancario' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Dados Bancários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Estes dados são utilizados para recebimento de comissões e split de pagamentos via Stripe Connect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Select value={dadosBancarios.banco} onValueChange={(value) => setDadosBancarios({...dadosBancarios, banco: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map((banco) => (
                      <SelectItem key={banco.codigo} value={banco.codigo}>
                        {banco.codigo} - {banco.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  value={dadosBancarios.agencia}
                  onChange={(e) => setDadosBancarios({...dadosBancarios, agencia: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  value={dadosBancarios.conta}
                  onChange={(e) => setDadosBancarios({...dadosBancarios, conta: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_conta">Tipo de Conta</Label>
                <Select value={dadosBancarios.tipo_conta} onValueChange={(value) => setDadosBancarios({...dadosBancarios, tipo_conta: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                    <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="titular">Titular da Conta</Label>
                <Input
                  id="titular"
                  value={dadosBancarios.titular}
                  onChange={(e) => setDadosBancarios({...dadosBancarios, titular: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf_titular">CPF do Titular</Label>
                <Input
                  id="cpf_titular"
                  value={dadosBancarios.cpf_titular}
                  onChange={(e) => setDadosBancarios({...dadosBancarios, cpf_titular: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pix">Chave PIX</Label>
                <Input
                  id="pix"
                  value={dadosBancarios.pix}
                  onChange={(e) => setDadosBancarios({...dadosBancarios, pix: e.target.value})}
                  placeholder="E-mail, CPF, telefone ou chave aleatória"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configurações */}
      {activeTab === 'configuracoes' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notificações</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes_email">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-500">Receba atualizações sobre seus eventos por e-mail</p>
                  </div>
                  <Switch
                    id="notificacoes_email"
                    checked={configuracoes.notificacoes_email}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacoes_email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes_whatsapp">Notificações por WhatsApp</Label>
                    <p className="text-sm text-gray-500">Receba alertas importantes via WhatsApp</p>
                  </div>
                  <Switch
                    id="notificacoes_whatsapp"
                    checked={configuracoes.notificacoes_whatsapp}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, notificacoes_whatsapp: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="relatorios_automaticos">Relatórios Automáticos</Label>
                    <p className="text-sm text-gray-500">Gere relatórios automaticamente ao final dos eventos</p>
                  </div>
                  <Switch
                    id="relatorios_automaticos"
                    checked={configuracoes.relatorios_automaticos}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, relatorios_automaticos: checked})}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Privacidade</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compartilhar_dados_anonimos">Compartilhar Dados Anônimos</Label>
                  <p className="text-sm text-gray-500">Ajude a melhorar o ScribIA compartilhando dados anônimos</p>
                </div>
                <Switch
                  id="compartilhar_dados_anonimos"
                  checked={configuracoes.compartilhar_dados_anonimos}
                  onCheckedChange={(checked) => setConfiguracoes({...configuracoes, compartilhar_dados_anonimos: checked})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Aparência</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select value={configuracoes.idioma} onValueChange={(value) => setConfiguracoes({...configuracoes, idioma: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tema_escuro">Tema Escuro</Label>
                    <p className="text-sm text-gray-500">Ativar modo escuro</p>
                  </div>
                  <Switch
                    id="tema_escuro"
                    checked={configuracoes.tema_escuro}
                    onCheckedChange={(checked) => setConfiguracoes({...configuracoes, tema_escuro: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfiguracoesOrganizador;