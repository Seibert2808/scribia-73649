import React from 'react';
import { FileText, Calendar, Users, BookOpen, Plus, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RelatoriosExecutivos = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Executivos</h1>
          <p className="text-muted-foreground">Gere e gerencie relatórios analíticos dos seus eventos</p>
        </div>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          Os relatórios executivos consolidam estatísticas detalhadas de participação, engajamento e preferências dos participantes.
          Esta funcionalidade será ativada automaticamente quando você tiver dados suficientes.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O que será incluído</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Métricas de participação</li>
              <li>• Rankings de conteúdo</li>
              <li>• Análises de tendências</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights da IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Análises preditivas e recomendações personalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exportação</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Relatórios em PDF e Excel para compartilhamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atualização</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dados atualizados em tempo real
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-3">
            <p className="text-sm">
              <strong>1. Cadastre eventos:</strong> Adicione seus eventos e palestras
            </p>
            <p className="text-sm">
              <strong>2. Gere livebooks:</strong> Participantes começam a gerar conteúdo personalizado
            </p>
            <p className="text-sm">
              <strong>3. Análise automática:</strong> Nossa IA processa os dados e gera insights
            </p>
            <p className="text-sm">
              <strong>4. Relatórios prontos:</strong> Relatórios executivos ficam disponíveis para download
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosExecutivos;
