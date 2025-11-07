import React, { useState } from 'react';
import { User, Calendar, Mail, Phone, CreditCard, Brain, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useCustomAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: user?.profile?.nome_completo || '',
    whatsapp: user?.profile?.whatsapp || '',
  });

  const handleSave = async () => {
    try {
      // Aqui seria implementada a função de atualização do perfil
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nome_completo: user?.profile?.nome_completo || '',
      whatsapp: user?.profile?.whatsapp || '',
    });
    setIsEditing(false);
  };

  const getSubscriptionBadge = (plan: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-500' },
      plus: { label: 'Plus', color: 'bg-purple-500' },
      premium: { label: 'Premium', color: 'bg-yellow-500' }
    };
    return badges[plan as keyof typeof badges] || badges.free;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e preferências</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nome Completo
                </label>
                {isEditing ? (
                  <Input
                    value={formData.nome_completo}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.profile?.nome_completo || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  E-mail
                </label>
                <div className="flex items-center gap-2 py-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{user?.profile?.email}</p>
                </div>
                <p className="text-xs text-gray-500">Somente leitura</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  WhatsApp
                </label>
                {isEditing ? (
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{user?.profile?.whatsapp || 'Não informado'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  CPF
                </label>
                <p className="text-gray-900 py-2">{user?.profile?.cpf || 'Não informado'}</p>
                <p className="text-xs text-gray-500">Somente leitura</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Data de Cadastro
                </label>
                <div className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {user?.profile?.criado_em ? formatDate(user.profile.criado_em) : 'Não disponível'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Último Login
                </label>
                <div className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {user?.profile?.ultimo_login ? formatDate(user.profile.ultimo_login) : 'Não disponível'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assinatura e Perfil */}
        <div className="space-y-6">
          {/* Status da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge 
                  className={`${getSubscriptionBadge(user?.subscription?.plano || 'free').color} text-white mb-3`}
                >
                  {getSubscriptionBadge(user?.subscription?.plano || 'free').label}
                </Badge>
                <p className="text-sm text-gray-600 mb-4">
                  Plano atual ativo
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Gerenciar Assinatura
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Perfil de Aprendizado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Perfil de Aprendizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900 mb-1">
                    Pleno Compacto
                  </p>
                  <p className="text-sm text-purple-700">
                    Profissional de campo, prático e objetivo
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // Aqui seria aberto o modal da Bia
                    toast({
                      title: "Bia será aberta",
                      description: "O modal da Bia será implementado em breve.",
                    });
                  }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Reavaliar com a Bia
                </Button>
                
                <p className="text-xs text-gray-500">
                  A Bia analisará suas preferências e atualizará seu perfil de aprendizado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;