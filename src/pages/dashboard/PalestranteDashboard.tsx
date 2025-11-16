import { Card } from "@/components/ui/card";
import { Mic2, Users, Star, FileText } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PalestranteLayout } from "@/components/dashboard/PalestranteLayout";

const PalestranteDashboard = () => {
  return (
    <PalestranteLayout>
      <Helmet>
        <title>Dashboard Palestrante - ScribIA</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard do Palestrante</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas palestras e acompanhe seu impacto
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mic2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Palestras</p>
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
                <p className="text-sm text-muted-foreground">Audiência Total</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
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
                <p className="text-sm text-muted-foreground">Livebooks</p>
                <p className="text-2xl font-bold text-foreground">Em breve</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Minhas Palestras */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Minhas Palestras
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em desenvolvimento. Em breve você poderá gerenciar suas palestras.
            </p>
          </div>
        </Card>

        {/* Agenda */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Agenda de Eventos
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em desenvolvimento. Em breve você verá sua agenda completa.
            </p>
          </div>
        </Card>

        {/* Analytics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Analytics de Audiência
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em desenvolvimento. Em breve você terá acesso a analytics detalhados.
            </p>
          </div>
        </Card>
      </div>
    </PalestranteLayout>
  );
};

export default PalestranteDashboard;
