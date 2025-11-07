import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Users,
  BookOpen,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  RefreshCw,
  Plus,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RelatorioExecutivo {
  id: string;
  nome: string;
  evento: string;
  periodo: string;
  participantes_totais: number;
  palestras_total: number;
  livebooks_gerados: number;
  downloads_totais: number;
  engajamento_medio: number;
  gerado_em: string;
  url_pdf: string;
  status: 'processando' | 'concluido' | 'erro';
}

interface MetricaEvento {
  evento: string;
  participantes: number;
  palestras: number;
  livebooks: number;
  downloads: number;
  engajamento: number;
  perfil_predominante: string;
  tema_popular: string;
}

const RelatoriosExecutivos = () => {
  const [eventoFilter, setEventoFilter] = useState('todos');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - em produção viria do Supabase
  const relatorios: RelatorioExecutivo[] = [
    {
      id: '1',
      nome: 'Relatório Congresso de Ginecologia 2024',
      evento: 'Congresso de Ginecologia 2024',
      periodo: '10/03/2024 - 15/03/2024',
      participantes_totais: 450,
      palestras_total: 25,
      livebooks_gerados: 1240,
      downloads_totais: 2180,
      engajamento_medio: 87,
      gerado_em: '2024-03-16',
      url_pdf: '/relatorios/congresso-ginecologia-2024.pdf',
      status: 'concluido'
    },
    {
      id: '2',
      nome: 'Relatório Workshop Obstetrícia Moderna',
      evento: 'Workshop Obstetrícia Moderna',
      periodo: '05/03/2024 - 08/03/2024',
      participantes_totais: 280,
      palestras_total: 18,
      livebooks_gerados: 890,
      downloads_totais: 1560,
      engajamento_medio: 82,
      gerado_em: '2024-03-09',
      url_pdf: '/relatorios/workshop-obstetricia-2024.pdf',
      status: 'concluido'
    },
    {
      id: '3',
      nome: 'Relatório Simpósio Saúde Materna',
      evento: 'Simpósio Saúde Materna',
      periodo: '01/03/2024 - 03/03/2024',
      participantes_totais: 180,
      palestras_total: 12,
      livebooks_gerados: 520,
      downloads_totais: 890,
      engajamento_medio: 78,
      gerado_em: '2024-03-04',
      url_pdf: '/relatorios/simposio-saude-materna-2024.pdf',
      status: 'concluido'
    },
    {
      id: '4',
      nome: 'Relatório Mensal - Março 2024',
      evento: 'Todos os Eventos',
      periodo: '01/03/2024 - 31/03/2024',
      participantes_totais: 910,
      palestras_total: 55,
      livebooks_gerados: 2650,
      downloads_totais: 4630,
      engajamento_medio: 84,
      gerado_em: '2024-03-18',
      url_pdf: '/relatorios/mensal-marco-2024.pdf',
      status: 'processando'
    }
  ];

  const metricas: MetricaEvento[] = [
    {
      evento: 'Congresso de Ginecologia 2024',
      participantes: 450,
      palestras: 25,
      livebooks: 1240,
      downloads: 2180,
      engajamento: 87,
      perfil_predominante: 'Pleno Detalhado',
      tema_popular: 'Inteligência Artificial'
    },
    {
      evento: 'Workshop Obstetrícia Moderna',
      participantes: 280,
      palestras: 18,
      livebooks: 890,
      downloads: 1560,
      engajamento: 82,
      perfil_predominante: 'Sênior Executivo',
      tema_popular: 'Empreendedorismo'
    },
    {
      evento: 'Simpósio Saúde Materna',
      participantes: 180,
      palestras: 12,
      livebooks: 520,
      downloads: 890,
      engajamento: 78,
      perfil_predominante: 'Júnior Compacto',
      tema_popular: 'Humanização'
    }
  ];

  const eventos = ['Congresso de Ginecologia 2024', 'Workshop Obstetrícia Moderna', 'Simpósio Saúde Materna'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'processando':
        return 'Processando';
      case 'erro':
        return 'Erro';
      default:
        return status;
    }
  };

  const handleGerarRelatorio = async () => {
    setIsGenerating(true);
    // Simular geração de relatório
    setTimeout(() => {
      setIsGenerating(false);
      // Aqui seria feita a chamada para o n8n para gerar o relatório
    }, 3000);
  };

  const filteredRelatorios = relatorios.filter(relatorio => {
    return eventoFilter === 'todos' || relatorio.evento === eventoFilter || relatorio.evento === 'Todos os Eventos';
  });

  // Estatísticas gerais
  const totalParticipantes = metricas.reduce((sum, m) => sum + m.participantes, 0);
  const totalPalestras = metricas.reduce((sum, m) => sum + m.palestras, 0);
  const totalLivebooks = metricas.reduce((sum, m) => sum + m.livebooks, 0);
  const engajamentoMedio = Math.round(metricas.reduce((sum, m) => sum + m.engajamento, 0) / metricas.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Executivos</h1>
          <p className="text-gray-600">Gere e gerencie relatórios analíticos dos seus eventos</p>
        </div>
        <Button onClick={handleGerarRelatorio} disabled={isGenerating}>
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Gerando...' : 'Gerar Novo Relatório'}
        </Button>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalParticipantes}</div>
            <p className="text-xs text-muted-foreground">Todos os eventos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Palestras</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalPalestras}</div>
            <p className="text-xs text-muted-foreground">Conteúdo disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livebooks Gerados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalLivebooks}</div>
            <p className="text-xs text-muted-foreground">Média de {Math.round(totalLivebooks / totalParticipantes)} por participante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{engajamentoMedio}%</div>
            <p className="text-xs text-muted-foreground">Taxa de participação</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Evento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Resumo por Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metricas.map((metrica, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <h4 className="font-semibold text-gray-900 mb-3">{metrica.evento}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participantes:</span>
                    <span className="font-medium">{metrica.participantes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Palestras:</span>
                    <span className="font-medium">{metrica.palestras}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livebooks:</span>
                    <span className="font-medium text-purple-600">{metrica.livebooks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="font-medium text-green-600">{metrica.downloads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engajamento:</span>
                    <span className="font-medium text-orange-600">{metrica.engajamento}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">Perfil predominante:</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {metrica.perfil_predominante}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tema mais popular:</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {metrica.tema_popular}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Filter className="h-4 w-4 text-gray-400" />
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

      {/* Histórico de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Relatórios ({filteredRelatorios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Relatório</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Livebooks</TableHead>
                <TableHead>Engajamento</TableHead>
                <TableHead>Gerado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRelatorios.map((relatorio) => (
                <TableRow key={relatorio.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{relatorio.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{relatorio.evento}</TableCell>
                  <TableCell className="text-sm">{relatorio.periodo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{relatorio.participantes_totais}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-purple-600">{relatorio.livebooks_gerados}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${relatorio.engajamento_medio}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{relatorio.engajamento_medio}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(relatorio.gerado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(relatorio.status)}>
                      {getStatusLabel(relatorio.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {relatorio.status === 'concluido' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredRelatorios.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório encontrado</h3>
            <p className="text-gray-600 mb-4">
              Gere seu primeiro relatório executivo para acompanhar o desempenho dos seus eventos.
            </p>
            <Button onClick={handleGerarRelatorio}>
              <Plus className="h-4 w-4 mr-2" />
              Gerar Primeiro Relatório
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre o Relatório */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">O que inclui o Relatório Executivo?</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Métricas Principais:</h4>
              <ul className="text-sm space-y-1">
                <li>• Participantes totais e distribuição de perfis</li>
                <li>• Número de palestras e Livebooks gerados</li>
                <li>• Rankings das palestras mais acessadas</li>
                <li>• Taxa de engajamento e downloads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Insights da IA:</h4>
              <ul className="text-sm space-y-1">
                <li>• Temas preferidos e tendências</li>
                <li>• Análise de comportamento do público</li>
                <li>• Sugestões para próximos eventos</li>
                <li>• Taxa de uso do Tutor ScribIA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosExecutivos;