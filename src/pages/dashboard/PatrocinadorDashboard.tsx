import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PatrocinadorLayout } from "@/components/dashboard/PatrocinadorLayout";

const PatrocinadorDashboard = () => {
  return (
    <PatrocinadorLayout>
      <Helmet>
        <title>Dashboard Patrocinador - ScribIA</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard do Patrocinador</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o ROI e visibilidade do seu patrocínio
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ROI Estimado</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impressões</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leads Gerados</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Eventos Patrocinados */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Eventos Patrocinados
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em desenvolvimento. Em breve você poderá visualizar seus eventos patrocinados.
            </p>
          </div>
        </Card>

        {/* Relatórios */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Relatórios de Impacto
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em desenvolvimento. Em breve você terá acesso a relatórios detalhados.
            </p>
          </div>
        </Card>
      </div>
    </PatrocinadorLayout>
  );
};

export default PatrocinadorDashboard;
