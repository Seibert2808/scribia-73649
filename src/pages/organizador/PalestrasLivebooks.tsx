import React, { useState } from 'react';
import { 
  Presentation, 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Palestra {
  id: string;
  titulo: string;
  palestrante: string;
  evento: string;
  livebooks_gerados: number;
  downloads_pdf: number;
  downloads_docx: number;
  perfil_predominante: 'junior' | 'pleno' | 'senior';
  data_ultima_geracao: string;
  data_palestra: string;
  duracao: number; // em minutos
  categoria: string;
}

const PalestrasLivebooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventoFilter, setEventoFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');

  // Mock data - em produção viria do Supabase
  const palestras: Palestra[] = [
    {
      id: '1',
      titulo: 'IA na Saúde Materna: Revolucionando o Cuidado',
      palestrante: 'Dr. João Silva',
      evento: 'Congresso de Ginecologia 2024',
      livebooks_gerados: 218,
      downloads_pdf: 312,
      downloads_docx: 100,
      perfil_predominante: 'pleno',
      data_ultima_geracao: '2024-03-18',
      data_palestra: '2024-03-15',
      duracao: 60,
      categoria: 'Tecnologia'
    },
    {
      id: '2',
      titulo: 'Empreendedorismo em Obstetrícia: Construindo o Futuro',
      palestrante: 'Dra. Sabrina Seibert',
      evento: 'Workshop Obstetrícia Moderna',
      livebooks_gerados: 172,
      downloads_pdf: 259,
      downloads_docx: 100,
      perfil_predominante: 'senior',
      data_ultima_geracao: '2024-03-17',
      data_palestra: '2024-03-14',
      duracao: 90,
      categoria: 'Negócios'
    },
    {
      id: '3',
      titulo: 'Humanização no Parto: Práticas Baseadas em Evidências',
      palestrante: 'Dra. Maria Santos',
      evento: 'Simpósio Saúde Materna',
      livebooks_gerados: 145,
      downloads_pdf: 198,
      downloads_docx: 87,
      perfil_predominante: 'junior',
      data_ultima_geracao: '2024-03-16',
      data_palestra: '2024-03-13',
      duracao: 45,
      categoria: 'Humanização'
    },
    {
      id: '4',
      titulo: 'Saúde Digital: Telemedicina na Ginecologia',
      palestrante: 'Dr. Pedro Costa',
      evento: 'Congresso de Ginecologia 2024',
      livebooks_gerados: 134,
      downloads_pdf: 176,
      downloads_docx: 92,
      perfil_predominante: 'pleno',
      data_ultima_geracao: '2024-03-15',
      data_palestra: '2024-03-12',
      duracao: 75,
      categoria: 'Tecnologia'
    },
    {
      id: '5',
      titulo: 'Gestão de Clínicas: Otimização de Processos',
      palestrante: 'Dra. Ana Oliveira',
      evento: 'Workshop Obstetrícia Moderna',
      livebooks_gerados: 98,
      downloads_pdf: 142,
      downloads_docx: 65,
      perfil_predominante: 'senior',
      data_ultima_geracao: '2024-03-14',
      data_palestra: '2024-03-11',
      duracao: 60,
      categoria: 'Gestão'
    }
  ];

  const eventos = ['Congresso de Ginecologia 2024', 'Workshop Obstetrícia Moderna', 'Simpósio Saúde Materna'];
  const categorias = ['Tecnologia', 'Negócios', 'Humanização', 'Gestão'];

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'junior':
        return 'bg-green-100 text-green-800';
      case 'pleno':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerfilLabel = (perfil: string) => {
    switch (perfil) {
      case 'junior':
        return 'Júnior Compacto';
      case 'pleno':
        return 'Pleno Detalhado';
      case 'senior':
        return 'Sênior Executivo';
      default:
        return perfil;
    }
  };

  const filteredPalestras = palestras.filter(palestra => {
    const matchesSearch = palestra.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         palestra.palestrante.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvento = eventoFilter === 'todos' || palestra.evento === eventoFilter;
    const matchesCategoria = categoriaFilter === 'todas' || palestra.categoria === categoriaFilter;
    return matchesSearch && matchesEvento && matchesCategoria;
  });

  // Estatísticas
  const totalPalestras = palestras.length;
  const totalLivebooks = palestras.reduce((sum, p) => sum + p.livebooks_gerados, 0);
  const totalDownloads = palestras.reduce((sum, p) => sum + p.downloads_pdf + p.downloads_docx, 0);
  const mediaPorPalestra = Math.round(totalLivebooks / totalPalestras);

  // Top 3 palestras
  const topPalestras = [...palestras]
    .sort((a, b) => b.livebooks_gerados - a.livebooks_gerados)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Palestras e Livebooks</h1>
          <p className="text-gray-600">Acompanhe o desempenho do conteúdo dos seus eventos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Palestra
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Palestras</CardTitle>
            <Presentation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPalestras}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livebooks Gerados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalLivebooks}</div>
            <p className="text-xs text-muted-foreground">
              Média de {mediaPorPalestra} por palestra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalDownloads / totalLivebooks) * 100)}% taxa de download
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Palestra Mais Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{topPalestras[0]?.livebooks_gerados}</div>
            <p className="text-xs text-muted-foreground truncate">
              {topPalestras[0]?.titulo.substring(0, 30)}...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Palestras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top 3 Palestras Mais Acessadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPalestras.map((palestra, index) => (
              <div key={palestra.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{palestra.titulo}</h4>
                  <p className="text-sm text-gray-600">por {palestra.palestrante}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{palestra.livebooks_gerados}</div>
                  <p className="text-xs text-gray-500">Livebooks</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{palestra.downloads_pdf + palestra.downloads_docx}</div>
                  <p className="text-xs text-gray-500">Downloads</p>
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou palestrante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Categorias</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Palestras */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Palestras ({filteredPalestras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título da Palestra</TableHead>
                <TableHead>Palestrante</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Livebooks</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Perfil Predominante</TableHead>
                <TableHead>Última Geração</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPalestras.map((palestra) => (
                <TableRow key={palestra.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{palestra.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {palestra.categoria}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(palestra.data_palestra).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{palestra.palestrante}</p>
                    <p className="text-xs text-gray-500">{palestra.duracao} min</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{palestra.evento}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <span className="font-bold text-purple-600">{palestra.livebooks_gerados}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-red-500" />
                        <span className="text-sm">PDF: {palestra.downloads_pdf}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-blue-500" />
                        <span className="text-sm">DOCX: {palestra.downloads_docx}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPerfilColor(palestra.perfil_predominante)}>
                      {getPerfilLabel(palestra.perfil_predominante)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(palestra.data_ultima_geracao).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredPalestras.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma palestra encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou cadastre uma nova palestra.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PalestrasLivebooks;