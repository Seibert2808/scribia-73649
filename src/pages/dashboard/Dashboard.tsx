import React from 'react';
import { Calendar, BookOpen, Clock, Brain, TrendingUp, Users, FileText, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const Dashboard = () => {
  const { user } = useCustomAuth();

  // Mock data - em produção viria do Supabase
  const stats = {
    eventos_ano: 12,
    total_livebooks: 28,
    horas_processadas: 156,
    ultima_interacao_lia: '2024-03-17',
    eventos_recentes: [
      {
        id: '1',
        nome: 'Congresso de Tecnologia 2024',
        data: '2024-03-15',
        livebooks: 3
      },
      {
        id: '2',
        nome: 'Workshop de UX Design',
        data: '2024-02-20',
        livebooks: 2
      }
    ],
    livebooks_recentes: [
      {
        id: '1',
        titulo: 'IA e Machine Learning - Tendências 2024',
        data: '2024-03-17',
        tipo: 'completo'
      },
      {
        id: '2',
        titulo: 'Algoritmos de Deep Learning',
        data: '2024-03-16',
        tipo: 'compacto'
      }
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-6">
      {/* Saudação personalizada */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.profile?.nome_completo || 'Usuário'}! 👋
        </h1>
        <p className="text-purple-100">
          Bem-vindo ao seu painel ScribIA Plus. Aqui você pode acompanhar seus eventos, 
          Livebooks e interagir com nossos agentes inteligentes.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Eventos no Ano
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.eventos_ano}</div>
            <p className="text-xs text-gray-600 mt-1">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Livebooks Gerados
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total_livebooks}</div>
            <p className="text-xs text-gray-600 mt-1">
              +5 esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Horas Processadas
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.horas_processadas}h</div>
            <p className="text-xs text-gray-600 mt-1">
              Conteúdo total processado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Última Análise Bia
            </CardTitle>
            <Brain className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatDate(stats.ultima_interacao_lia)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Perfil atualizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eventos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.eventos_recentes.map((evento) => (
              <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{evento.nome}</h4>
                  <p className="text-sm text-gray-600">{formatDate(evento.data)}</p>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {evento.livebooks} Livebooks
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver todos os eventos
            </Button>
          </CardContent>
        </Card>

        {/* Livebooks Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Livebooks Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.livebooks_recentes.map((livebook) => (
              <div key={livebook.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{livebook.titulo}</h4>
                  <p className="text-sm text-gray-600">{formatDate(livebook.data)}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={livebook.tipo === 'completo' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}
                >
                  {livebook.tipo === 'completo' ? 'Completo' : 'Compacto'}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver todos os Livebooks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Perfil de Aprendizado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Seu Perfil de Aprendizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pleno Compacto
                </h3>
                <p className="text-gray-700 mb-3">
                  Profissional de campo, prático e objetivo. Prefere conteúdos diretos e aplicáveis.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>✓ Resumos compactos</span>
                  <span>✓ Foco em aplicação prática</span>
                  <span>✓ Linguagem objetiva</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Reavaliar com Bia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acesso Rápido aos Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-5 w-5" />
              Bia - Análise de Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Converse com a Bia para reavaliar seu perfil de aprendizado e personalizar 
              ainda mais seus Livebooks.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Brain className="h-4 w-4 mr-2" />
              Conversar com Bia
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5" />
              Tutor ScribIA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Tire dúvidas sobre seus Livebooks e receba explicações personalizadas 
              baseadas no seu conteúdo.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Conversar com Tutor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dicas e Sugestões */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            Dicas para Aproveitar Melhor o ScribIA Plus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Cadastre Eventos</h4>
              <p className="text-sm text-gray-600">
                Organize seus eventos para gerar Livebooks mais contextualizados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Use a Bia</h4>
              <p className="text-sm text-gray-600">
                Reavalie seu perfil regularmente para conteúdos mais personalizados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Explore Formatos</h4>
              <p className="text-sm text-gray-600">
                Baixe seus Livebooks em PDF ou DOCX conforme sua necessidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;