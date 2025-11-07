import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Participante {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  evento: string;
  perfil: 'junior' | 'pleno' | 'senior';
  livebooks_gerados: number;
  ultima_atividade: string;
  status: 'ativo' | 'inativo';
}

const Participantes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventoFilter, setEventoFilter] = useState('todos');
  const [perfilFilter, setPerfilFilter] = useState('todos');

  // Mock data - em produção viria do Supabase
  const participantes: Participante[] = [
    {
      id: '1',
      nome: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      whatsapp: '+55 11 99999-9999',
      evento: 'Congresso de Ginecologia 2024',
      perfil: 'senior',
      livebooks_gerados: 12,
      ultima_atividade: '2024-03-17',
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Dra. Maria Santos',
      email: 'maria.santos@email.com',
      whatsapp: '+55 21 88888-8888',
      evento: 'Workshop Obstetrícia Moderna',
      perfil: 'pleno',
      livebooks_gerados: 8,
      ultima_atividade: '2024-03-16',
      status: 'ativo'
    },
    {
      id: '3',
      nome: 'Dr. Pedro Costa',
      email: 'pedro.costa@email.com',
      whatsapp: '+55 31 77777-7777',
      evento: 'Simpósio Saúde Materna',
      perfil: 'junior',
      livebooks_gerados: 5,
      ultima_atividade: '2024-03-15',
      status: 'inativo'
    },
    {
      id: '4',
      nome: 'Dra. Ana Oliveira',
      email: 'ana.oliveira@email.com',
      whatsapp: '+55 85 66666-6666',
      evento: 'Congresso de Ginecologia 2024',
      perfil: 'senior',
      livebooks_gerados: 15,
      ultima_atividade: '2024-03-18',
      status: 'ativo'
    },
    {
      id: '5',
      nome: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@email.com',
      whatsapp: '+55 47 55555-5555',
      evento: 'Workshop Obstetrícia Moderna',
      perfil: 'pleno',
      livebooks_gerados: 9,
      ultima_atividade: '2024-03-14',
      status: 'ativo'
    }
  ];

  const eventos = ['Congresso de Ginecologia 2024', 'Workshop Obstetrícia Moderna', 'Simpósio Saúde Materna'];

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
        return 'Júnior';
      case 'pleno':
        return 'Pleno';
      case 'senior':
        return 'Sênior';
      default:
        return perfil;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredParticipantes = participantes.filter(participante => {
    const matchesSearch = participante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participante.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvento = eventoFilter === 'todos' || participante.evento === eventoFilter;
    const matchesPerfil = perfilFilter === 'todos' || participante.perfil === perfilFilter;
    return matchesSearch && matchesEvento && matchesPerfil;
  });

  // Estatísticas
  const totalParticipantes = participantes.length;
  const participantesAtivos = participantes.filter(p => p.status === 'ativo').length;
  const totalLivebooks = participantes.reduce((sum, p) => sum + p.livebooks_gerados, 0);
  const perfilDistribution = {
    junior: participantes.filter(p => p.perfil === 'junior').length,
    pleno: participantes.filter(p => p.perfil === 'pleno').length,
    senior: participantes.filter(p => p.perfil === 'senior').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
          <p className="text-gray-600">Gerencie e acompanhe os participantes dos seus eventos</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Lista
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalParticipantes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{participantesAtivos}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((participantesAtivos / totalParticipantes) * 100)}% do total
            </p>
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
              Média de {Math.round(totalLivebooks / totalParticipantes)} por participante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Predominante</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {perfilDistribution.pleno > perfilDistribution.junior && perfilDistribution.pleno > perfilDistribution.senior ? 'Pleno' :
               perfilDistribution.senior > perfilDistribution.junior ? 'Sênior' : 'Júnior'}
            </div>
            <p className="text-xs text-muted-foreground">
              J: {perfilDistribution.junior} | P: {perfilDistribution.pleno} | S: {perfilDistribution.senior}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
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
            <Select value={perfilFilter} onValueChange={setPerfilFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Perfis</SelectItem>
                <SelectItem value="junior">Júnior</SelectItem>
                <SelectItem value="pleno">Pleno</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Participantes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Participantes ({filteredParticipantes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Livebooks</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipantes.map((participante) => (
                <TableRow key={participante.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{participante.nome}</p>
                      <p className="text-sm text-gray-500">{participante.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{participante.evento}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPerfilColor(participante.perfil)}>
                      {getPerfilLabel(participante.perfil)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{participante.livebooks_gerados}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(participante.ultima_atividade).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(participante.status)}>
                      {participante.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredParticipantes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum participante encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou aguarde novos cadastros.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Participantes;