import React, { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download,
  Calendar,
  Users,
  BookOpen,
  Award,
  Target,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RankingPalestra {
  posicao: number;
  titulo: string;
  palestrante: string;
  evento: string;
  livebooks_gerados: number;
  downloads_totais: number;
  engajamento: number;
  categoria: string;
}

interface TemaPopular {
  tema: string;
  mencoes: number;
  crescimento: number;
  categoria: string;
  cor: string;
}

interface InsightIA {
  tipo: 'tendencia' | 'comportamento' | 'recomendacao';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  icone: string;
}

const RankingsTendencias = () => {
  const [periodoFilter, setPeriodoFilter] = useState('ultimo_mes');
  const [eventoFilter, setEventoFilter] = useState('todos');

  // Mock data - em produção viria do Supabase com análise de IA
  const rankingPalestras: RankingPalestra[] = [
    {
      posicao: 1,
      titulo: 'IA na Saúde Materna: Revolucionando o Cuidado',
      palestrante: 'Dr. João Silva',
      evento: 'Congresso de Ginecologia 2024',
      livebooks_gerados: 218,
      downloads_totais: 412,
      engajamento: 89,
      categoria: 'Tecnologia'
    },
    {
      posicao: 2,
      titulo: 'Empreendedorismo em Obstetrícia: Construindo o Futuro',
      palestrante: 'Dra. Sabrina Seibert',
      evento: 'Workshop Obstetrícia Moderna',
      livebooks_gerados: 172,
      downloads_totais: 359,
      engajamento: 85,
      categoria: 'Negócios'
    },
    {
      posicao: 3,
      titulo: 'Humanização no Parto: Práticas Baseadas em Evidências',
      palestrante: 'Dra. Maria Santos',
      evento: 'Simpósio Saúde Materna',
      livebooks_gerados: 145,
      downloads_totais: 285,
      engajamento: 78,
      categoria: 'Humanização'
    },
    {
      posicao: 4,
      titulo: 'Saúde Digital: Telemedicina na Ginecologia',
      palestrante: 'Dr. Pedro Costa',
      evento: 'Congresso de Ginecologia 2024',
      livebooks_gerados: 134,
      downloads_totais: 268,
      engajamento: 76,
      categoria: 'Tecnologia'
    },
    {
      posicao: 5,
      titulo: 'Gestão de Clínicas: Otimização de Processos',
      palestrante: 'Dra. Ana Oliveira',
      evento: 'Workshop Obstetrícia Moderna',
      livebooks_gerados: 98,
      downloads_totais: 207,
      engajamento: 71,
      categoria: 'Gestão'
    }
  ];

  const temasPopulares: TemaPopular[] = [
    {
      tema: 'Inteligência Artificial',
      mencoes: 342,
      crescimento: 45,
      categoria: 'Tecnologia',
      cor: 'bg-blue-500'
    },
    {
      tema: 'Humanização',
      mencoes: 287,
      crescimento: 23,
      categoria: 'Cuidado',
      cor: 'bg-green-500'
    },
    {
      tema: 'Saúde Digital',
      mencoes: 234,
      crescimento: 67,
      categoria: 'Tecnologia',
      cor: 'bg-purple-500'
    },
    {
      tema: 'Empreendedorismo',
      mencoes: 198,
      crescimento: 34,
      categoria: 'Negócios',
      cor: 'bg-orange-500'
    },
    {
      tema: 'Telemedicina',
      mencoes: 156,
      crescimento: 89,
      categoria: 'Tecnologia',
      cor: 'bg-cyan-500'
    },
    {
      tema: 'Gestão Clínica',
      mencoes: 134,
      crescimento: 12,
      categoria: 'Gestão',
      cor: 'bg-red-500'
    }
  ];

  const insightsIA: InsightIA[] = [
    {
      tipo: 'tendencia',
      titulo: 'Crescimento em Temas de IA',
      descricao: 'Palestras sobre Inteligência Artificial tiveram 67% mais engajamento que a média geral.',
      impacto: 'alto',
      icone: '🤖'
    },
    {
      tipo: 'comportamento',
      titulo: 'Perfil Predominante: Pleno',
      descricao: 'O público deste evento tem maior afinidade com resumos detalhados e aplicações práticas.',
      impacto: 'medio',
      icone: '👥'
    },
    {
      tipo: 'recomendacao',
      titulo: 'Oportunidade: Saúde Digital',
      descricao: 'Considere mais palestras sobre Telemedicina - tema com 89% de crescimento no interesse.',
      impacto: 'alto',
      icone: '💡'
    },
    {
      tipo: 'tendencia',
      titulo: 'Horário de Maior Engajamento',
      descricao: 'Palestras entre 14h-16h geram 34% mais Livebooks que outros horários.',
      impacto: 'medio',
      icone: '⏰'
    }
  ];

  const eventos = ['Congresso de Ginecologia 2024', 'Workshop Obstetrícia Moderna', 'Simpósio Saúde Materna'];

  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${posicao}º`;
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto':
        return 'bg-red-100 text-red-800';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'tendencia':
        return 'bg-blue-100 text-blue-800';
      case 'comportamento':
        return 'bg-purple-100 text-purple-800';
      case 'recomendacao':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rankings e Tendências</h1>
          <p className="text-gray-600">Inteligência de engajamento e interesse do público</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultima_semana">Última Semana</SelectItem>
                <SelectItem value="ultimo_mes">Último Mês</SelectItem>
                <SelectItem value="ultimo_trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ultimo_ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eventoFilter} onValueChange={setEventoFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Eventos</SelectItem>
                {eventos.map(evento => (
                  <SelectItem key={evento} value={evento}>{evento}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Insights da IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Insights da IA ScribIA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insightsIA.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{insight.icone}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTipoColor(insight.tipo)}>
                        {insight.tipo === 'tendencia' ? 'Tendência' : 
                         insight.tipo === 'comportamento' ? 'Comportamento' : 'Recomendação'}
                      </Badge>
                      <Badge className={getImpactoColor(insight.impacto)}>
                        Impacto {insight.impacto}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.titulo}</h4>
                    <p className="text-sm text-gray-600">{insight.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking das 10 Palestras Mais Acessadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top 5 Palestras Mais Acessadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankingPalestras.map((palestra) => (
                <div key={palestra.posicao} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold">
                      {getPosicaoIcon(palestra.posicao)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{palestra.titulo}</h4>
                    <p className="text-xs text-gray-600">por {palestra.palestrante}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {palestra.categoria}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-purple-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-bold">{palestra.livebooks_gerados}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <Download className="h-3 w-3" />
                      <span>{palestra.downloads_totais}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {palestra.engajamento}% engajamento
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Temas Preferidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Temas Mais Procurados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {temasPopulares.map((tema, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${tema.cor}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tema.tema}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{tema.mencoes}</span>
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          tema.crescimento > 50 ? 'bg-green-100 text-green-800' :
                          tema.crescimento > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          +{tema.crescimento}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${tema.cor}`}
                          style={{ width: `${(tema.mencoes / 342) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{tema.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada de Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Detalhado de Palestras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Título da Palestra</TableHead>
                <TableHead>Palestrante</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Livebooks</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Engajamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingPalestras.map((palestra) => (
                <TableRow key={palestra.posicao}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPosicaoIcon(palestra.posicao)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{palestra.titulo}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {palestra.categoria}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{palestra.palestrante}</TableCell>
                  <TableCell className="text-sm">{palestra.evento}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <span className="font-bold text-purple-600">{palestra.livebooks_gerados}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-green-500" />
                      <span className="font-bold text-green-600">{palestra.downloads_totais}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${palestra.engajamento}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{palestra.engajamento}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estatísticas Complementares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tema Mais Procurado</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Inteligência Artificial</div>
            <p className="text-xs text-muted-foreground">342 menções nos últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Telemedicina</div>
            <p className="text-xs text-muted-foreground">+89% de interesse no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Mais Interessado</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Pleno Detalhado</div>
            <p className="text-xs text-muted-foreground">67% dos Livebooks gerados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankingsTendencias;