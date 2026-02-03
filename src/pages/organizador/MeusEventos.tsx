import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Search,
  Play,
  Clock,
  CheckCircle,
  Mic,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '@/hooks/useMockData';

interface Evento {
  id: string;
  nome_evento: string;
  data_inicio: string;
  data_fim: string;
  cidade: string;
  estado: string;
  pais: string;
  status: string;
  participantes: number;
  livebooks: number;
  palestras: number;
}

const MeusEventos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getEventos } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      
      const mockEventos = getEventos();
      const eventosFormatados: Evento[] = mockEventos.map(evt => ({
        id: evt.id,
        nome_evento: evt.nome,
        data_inicio: evt.data_inicio,
        data_fim: evt.data_fim || evt.data_inicio,
        cidade: evt.local?.split(',')[0] || 'São Paulo',
        estado: 'SP',
        pais: 'Brasil',
        status: evt.status === 'ativo' ? 'Em andamento' : 'Agendado',
        participantes: evt.total_participantes || 0,
        livebooks: evt.total_palestras || 0,
        palestras: evt.total_palestras || 0,
      }));
      
      setEventos(eventosFormatados);
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      toast({
        title: 'Erro ao carregar eventos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEventos = eventos.filter(evento => {
    const local = `${evento.cidade}, ${evento.estado}, ${evento.pais}`;
    const matchesSearch = evento.nome_evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         local.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || evento.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: eventos.length,
    ativos: eventos.filter(e => e.status === 'Em andamento').length,
    agendados: eventos.filter(e => e.status === 'Agendado').length,
    concluidos: eventos.filter(e => e.status === 'Concluído').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Concluído':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return '🟢';
      case 'Agendado':
        return '🔵';
      case 'Concluído':
        return '⚪';
      default:
        return '⚪';
    }
  };

  const formatPeriodo = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    const fim = new Date(dataFim).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return dataInicio === dataFim ? inicio : `${inicio} - ${fim}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8" />
              Meus Eventos
            </h1>
            <p className="text-purple-100 text-lg">
              Gerencie todos os seus eventos e acompanhe o desempenho
            </p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/eventos')}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-6 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-3xl font-bold text-green-600">{stats.ativos}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendados</p>
                <p className="text-3xl font-bold text-blue-600">{stats.agendados}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-3xl font-bold text-gray-600">{stats.concluidos}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'todos' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('todos')}
                className={statusFilter === 'todos' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-200 text-purple-700 hover:bg-purple-50'}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'em andamento' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('em andamento')}
                className={statusFilter === 'em andamento' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-700 hover:bg-green-50'}
              >
                Em Andamento
              </Button>
              <Button
                variant={statusFilter === 'agendado' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('agendado')}
                className={statusFilter === 'agendado' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}
              >
                Agendados
              </Button>
              <Button
                variant={statusFilter === 'concluído' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('concluído')}
                className={statusFilter === 'concluído' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}
              >
                Concluídos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEventos.map((evento) => (
          <Card key={evento.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{evento.nome_evento}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatPeriodo(evento.data_inicio, evento.data_fim)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{evento.cidade}, {evento.estado}, {evento.pais}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(evento.status)} font-medium px-3 py-1`}>
                    {getStatusIcon(evento.status)} {evento.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2 mx-auto">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{evento.participantes}</p>
                    <p className="text-xs text-gray-500">Participantes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-2 mx-auto">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{evento.livebooks}</p>
                    <p className="text-xs text-gray-500">Livebooks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-2 mx-auto">
                      <Mic className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{evento.palestras}</p>
                    <p className="text-xs text-gray-500">Palestras</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => navigate(`/dashboard/eventos/${evento.id}/palestras`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Palestras
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate('/dashboard/eventos')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEventos.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece criando seu primeiro evento.'}
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/dashboard/eventos')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeusEventos;