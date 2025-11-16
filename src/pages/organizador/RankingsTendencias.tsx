import React from 'react';
import { Trophy, Brain, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RankingsTendencias = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rankings e Tendências</h1>
          <p className="text-muted-foreground">Inteligência de engajamento e interesse do público</p>
        </div>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          Os rankings e análises de tendências serão gerados automaticamente conforme você acumular dados de eventos e livebooks.
          Continue cadastrando eventos e palestras para visualizar insights detalhados!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top Palestras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rankings das palestras mais acessadas aparecerão aqui após a geração de livebooks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Temas em Alta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Análise dos temas mais procurados pelos participantes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recomendações inteligentes baseadas no comportamento dos participantes.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Como funciona a análise</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-800">
          <div className="space-y-3">
            <p className="text-sm">
              <strong>Rankings automáticos:</strong> Identificamos as palestras mais populares com base em visualizações e downloads
            </p>
            <p className="text-sm">
              <strong>Análise de tendências:</strong> Detectamos padrões nos temas escolhidos pelos participantes
            </p>
            <p className="text-sm">
              <strong>Insights preditivos:</strong> Sugerimos temas e formatos para próximos eventos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingsTendencias;
