import React from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  BookOpen, 
  Download, 
  TrendingUp,
  Award,
  Brain,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const OrganizadorDashboard = () => {
  const { user } = useCustomAuth();

  // Mock data - em produção viria do Supabase
  const stats = [
    { 
      title: 'Eventos Ativos', 
      value: '1', 
      icon: Calendar, 
      change: 'SIAPARTO 2024',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Participantes Inscritos', 
      value: '342', 
      icon: Users, 
      change: '+28 esta semana',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Palestras Confirmadas', 
      value: '18', 
      icon: FileText, 
      change: '3 dias de evento',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      title: 'Livebooks Disponíveis', 
      value: '12', 
      icon: BookOpen, 
      change: 'Prontos para download',
      color: 'from-violet-500 to-violet-600'
    },
    { 
      title: 'Downloads Realizados', 
      value: '89', 
      icon: Download, 
      change: '+15 hoje',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      title: 'Taxa de Engajamento', 
      value: '87%', 
      icon: TrendingUp, 
      change: 'Acima da média',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const recentEvents = [
    {
      id: 1,
      name: 'SIAPARTO - Simpósio Internacional de Assistência ao Parto',
      date: '17-19 Out 2024',
      participants: 342,
      livebooks: 12,
      status: 'Preparação final',
      statusColor: 'bg-orange-100 text-orange-800'
    }
  ];

  const popularLivebooks = [
    {
      title: 'Assistência Humanizada ao Parto',
      author: 'Dra. Ana Beatriz Costa',
      downloads: 45,
      category: 'Humanização'
    },
    {
      title: 'Tecnologias no Trabalho de Parto',
      author: 'Dr. Carlos Mendes',
      downloads: 38,
      category: 'Tecnologia'
    },
    {
      title: 'Parto Natural: Evidências Científicas',
      author: 'Dra. Fernanda Lima',
      downloads: 32,
      category: 'Evidências'
    },
    {
      title: 'Gestão da Dor no Parto',
      author: 'Dr. Roberto Silva',
      downloads: 28,
      category: 'Analgesia'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              SIAPARTO 2024 - São Paulo 🏥
            </h1>
            <p className="text-purple-100 text-lg">
              Simpósio Internacional de Assistência ao Parto • 17-19 de Outubro
            </p>
            <p className="text-purple-200 text-sm mt-2">
              Acompanhe o progresso do seu evento e o engajamento dos participantes
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{event.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participants} participantes
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {event.livebooks} livebooks
                      </span>
                    </div>
                  </div>
                  <Badge className={`${event.statusColor} border-0`}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50">
              Ver Todos os Eventos
            </Button>
          </CardContent>
        </Card>

        {/* Popular Livebooks */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Livebooks Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularLivebooks.map((livebook, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{livebook.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{livebook.author}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {livebook.category}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {livebook.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50">
              Ver Todos os Livebooks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Event Performance Analytics */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            Análise de Desempenho - SIAPARTO 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Taxa de Conversão</h4>
              <p className="text-gray-700">
                <strong>89% dos inscritos</strong> confirmaram presença, superando a meta de 85% 
                estabelecida para o evento.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Engajamento com Conteúdo</h4>
              <p className="text-gray-700">
                <strong>67% dos participantes</strong> já baixaram pelo menos um livebook, 
                indicando alto interesse no material disponibilizado.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Distribuição Geográfica</h4>
              <p className="text-gray-700">
                Participantes de <strong>12 estados brasileiros</strong>, com maior concentração 
                em São Paulo (45%) e Rio de Janeiro (18%).
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Feedback Preliminar</h4>
              <p className="text-gray-700">
                Avaliação média de <strong>4.8/5.0</strong> nas pesquisas de expectativa, 
                com destaque para a qualidade dos palestrantes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizadorDashboard;