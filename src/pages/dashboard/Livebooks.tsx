import React, { useState } from 'react';
import { BookOpen, Search, Filter, Download, Eye, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Livebook {
  id: string;
  titulo: string;
  data_criacao: string;
  evento_relacionado?: string;
  tipo_resumo: 'completo' | 'compacto';
  nivel_perfil: 'junior' | 'pleno' | 'senior';
  formatos: {
    pdf: boolean;
    docx: boolean;
  };
  status: 'processando' | 'concluido' | 'erro';
}

const Livebooks = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'com-evento' | 'sem-evento'>('todos');

  // Mock data - em produção viria do Supabase
  const livebooks: Livebook[] = [
    {
      id: '1',
      titulo: 'IA e Machine Learning - Tendências 2024',
      data_criacao: '2024-03-17',
      evento_relacionado: 'Congresso de Tecnologia 2024',
      tipo_resumo: 'completo',
      nivel_perfil: 'pleno',
      formatos: { pdf: true, docx: true },
      status: 'concluido'
    },
    {
      id: '2',
      titulo: 'Algoritmos de Deep Learning',
      data_criacao: '2024-03-16',
      evento_relacionado: 'Congresso de Tecnologia 2024',
      tipo_resumo: 'compacto',
      nivel_perfil: 'senior',
      formatos: { pdf: true, docx: false },
      status: 'concluido'
    },
    {
      id: '3',
      titulo: 'Princípios de UX Design',
      data_criacao: '2024-02-20',
      evento_relacionado: 'Workshop de UX Design',
      tipo_resumo: 'completo',
      nivel_perfil: 'pleno',
      formatos: { pdf: true, docx: true },
      status: 'concluido'
    },
    {
      id: '4',
      titulo: 'Análise de Dados com Python',
      data_criacao: '2024-02-15',
      tipo_resumo: 'compacto',
      nivel_perfil: 'junior',
      formatos: { pdf: true, docx: false },
      status: 'processando'
    },
    {
      id: '5',
      titulo: 'Metodologias Ágeis',
      data_criacao: '2024-01-12',
      evento_relacionado: 'Seminário de Inovação',
      tipo_resumo: 'completo',
      nivel_perfil: 'pleno',
      formatos: { pdf: true, docx: true },
      status: 'concluido'
    }
  ];

  const filteredLivebooks = livebooks.filter(livebook => {
    const matchesSearch = livebook.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livebook.evento_relacionado?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'todos' ||
                         (filterType === 'com-evento' && livebook.evento_relacionado) ||
                         (filterType === 'sem-evento' && !livebook.evento_relacionado);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      concluido: { label: 'Concluído', color: 'bg-green-500' },
      processando: { label: 'Processando', color: 'bg-yellow-500' },
      erro: { label: 'Erro', color: 'bg-red-500' }
    };
    return badges[status as keyof typeof badges] || badges.concluido;
  };

  const getTipoResumo = (tipo: string) => {
    return tipo === 'completo' ? 'Completo' : 'Compacto';
  };

  const getNivelPerfil = (nivel: string) => {
    const niveis = {
      junior: 'Júnior',
      pleno: 'Pleno',
      senior: 'Sênior'
    };
    return niveis[nivel as keyof typeof niveis] || nivel;
  };

  const handleView = (livebookId: string) => {
    toast({
      title: "Visualizar Livebook",
      description: "Abrindo visualização do Livebook...",
    });
  };

  const handleDownload = (livebookId: string, format: 'pdf' | 'docx') => {
    toast({
      title: `Download ${format.toUpperCase()}`,
      description: `Iniciando download do Livebook em ${format.toUpperCase()}...`,
    });
  };

  const handleDelete = (livebookId: string) => {
    toast({
      title: "Excluir Livebook",
      description: "Confirmação de exclusão será implementada.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Livebooks</h1>
          <p className="text-gray-600 mt-1">Todos os seus materiais de estudo personalizados</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por título, evento, data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filterType === 'todos' ? 'default' : 'outline'}
            onClick={() => setFilterType('todos')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filterType === 'com-evento' ? 'default' : 'outline'}
            onClick={() => setFilterType('com-evento')}
            size="sm"
          >
            Com evento
          </Button>
          <Button
            variant={filterType === 'sem-evento' ? 'default' : 'outline'}
            onClick={() => setFilterType('sem-evento')}
            size="sm"
          >
            Sem evento
          </Button>
        </div>
      </div>

      {/* Lista de Livebooks */}
      <div className="space-y-4">
        {filteredLivebooks.map((livebook) => (
          <Card key={livebook.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <BookOpen className="h-5 w-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {livebook.titulo}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Data:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">
                              {formatDate(livebook.data_criacao)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Evento:</span>
                          <p className="text-sm font-medium">
                            {livebook.evento_relacionado || 'Sem vínculo'}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Tipo:</span>
                          <p className="text-sm font-medium">
                            {getTipoResumo(livebook.tipo_resumo)} - {getNivelPerfil(livebook.nivel_perfil)}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm text-gray-500">Status:</span>
                          <Badge 
                            className={`${getStatusBadge(livebook.status).color} text-white text-xs`}
                          >
                            {getStatusBadge(livebook.status).label}
                          </Badge>
                        </div>
                      </div>

                      {/* Formatos disponíveis */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500">Formatos:</span>
                        <div className="flex gap-2">
                          {livebook.formatos.pdf && (
                            <Badge variant="outline" className="text-xs">PDF</Badge>
                          )}
                          {livebook.formatos.docx && (
                            <Badge variant="outline" className="text-xs">DOCX</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(livebook.id)}
                    disabled={livebook.status !== 'concluido'}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Visualizar
                  </Button>

                  {livebook.status === 'concluido' && (
                    <div className="flex gap-1">
                      {livebook.formatos.pdf && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(livebook.id, 'pdf')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      )}
                      {livebook.formatos.docx && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(livebook.id, 'docx')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          DOCX
                        </Button>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(livebook.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredLivebooks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum Livebook encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `Nenhum resultado para "${searchTerm}"`
                : 'Você ainda não possui Livebooks gerados.'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estatísticas no rodapé */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{livebooks.length}</div>
              <div className="text-sm text-gray-600">Total de Livebooks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {livebooks.filter(l => l.evento_relacionado).length}
              </div>
              <div className="text-sm text-gray-600">Com evento</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {livebooks.filter(l => l.status === 'concluido').length}
              </div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {livebooks.filter(l => l.status === 'processando').length}
              </div>
              <div className="text-sm text-gray-600">Processando</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Livebooks;