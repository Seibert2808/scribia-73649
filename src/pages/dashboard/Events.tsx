import React, { useState } from 'react';
import { Calendar, MapPin, Plus, Filter, Eye, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  cidade: string;
  estado: string;
  pais: string;
  observacoes?: string;
  livebooks_count: number;
}

const Events = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - em produção viria do Supabase
  const events: Event[] = [
    {
      id: '1',
      nome: 'Congresso de Tecnologia 2024',
      data_inicio: '2024-03-15',
      data_fim: '2024-03-17',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil',
      observacoes: 'Evento focado em IA e Machine Learning',
      livebooks_count: 5
    },
    {
      id: '2',
      nome: 'Workshop de UX Design',
      data_inicio: '2024-02-20',
      data_fim: '2024-02-20',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil',
      observacoes: 'Design centrado no usuário',
      livebooks_count: 2
    },
    {
      id: '3',
      nome: 'Seminário de Inovação',
      data_inicio: '2024-01-10',
      data_fim: '2024-01-12',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      pais: 'Brasil',
      livebooks_count: 3
    }
  ];

  const years = ['2024', '2023', '2022', '2021'];
  
  const filteredEvents = events.filter(event => 
    new Date(event.data_inicio).getFullYear().toString() === selectedYear
  );

  const totalEvents = filteredEvents.length;
  const totalLivebooks = filteredEvents.reduce((sum, event) => sum + event.livebooks_count, 0);
  const lastEvent = filteredEvents.sort((a, b) => 
    new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
  )[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return start === end ? start : `${start} - ${end}`;
  };

  const handleViewEvent = (eventId: string) => {
    toast({
      title: "Visualizar evento",
      description: "Redirecionando para detalhes do evento...",
    });
  };

  const handleEditEvent = (eventId: string) => {
    toast({
      title: "Editar evento",
      description: "Modal de edição será aberto em breve.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    toast({
      title: "Excluir evento",
      description: "Confirmação de exclusão será implementada.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Eventos</h1>
          <p className="text-gray-600 mt-1">Eventos que participei e seus Livebooks</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filtros e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filtro por Ano */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por ano</span>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalEvents}</div>
            <div className="text-sm text-gray-600">Total de eventos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalLivebooks}</div>
            <div className="text-sm text-gray-600">Livebooks gerados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-gray-900">
              {lastEvent ? lastEvent.nome : 'Nenhum evento'}
            </div>
            <div className="text-xs text-gray-600">Último evento</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{event.nome}</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {event.livebooks_count} Livebooks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Data */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDateRange(event.data_inicio, event.data_fim)}</span>
              </div>

              {/* Local */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{event.cidade}, {event.estado}, {event.pais}</span>
              </div>

              {/* Observações */}
              {event.observacoes && (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {event.observacoes}
                </p>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewEvent(event.id)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEvent(event.id)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredEvents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Você ainda não participou de nenhum evento em {selectedYear}.
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Adicionar Evento - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Evento</h3>
            <p className="text-gray-600 mb-4">
              Modal de cadastro de evento será implementado em breve.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;