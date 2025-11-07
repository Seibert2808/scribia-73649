import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Palestra } from "@/types/palestra";
import PageLayout from "@/components/dashboard/PageLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PalestrasList = () => {
  const { eventoId } = useParams<{ eventoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [palestras, setPalestras] = useState<Palestra[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [palestraToDelete, setPalestraToDelete] = useState<string | null>(null);
  const [nomeEvento, setNomeEvento] = useState("");

  useEffect(() => {
    if (eventoId && user) {
      fetchEvento();
      fetchPalestras();
    }
  }, [eventoId, user]);

  const fetchEvento = async () => {
    try {
      const { data, error } = await supabase
        .from("scribia_eventos")
        .select("nome_evento")
        .eq("id", eventoId!)
        .single();

      if (error) throw error;
      setNomeEvento(data?.nome_evento || "");
    } catch (error: any) {
      console.error("Erro ao buscar evento:", error);
    }
  };

  const fetchPalestras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scribia_palestras")
        .select("*")
        .eq("evento_id", eventoId!)
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setPalestras(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar palestras",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPalestraToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!palestraToDelete) return;

    try {
      const { error } = await supabase
        .from("scribia_palestras")
        .delete()
        .eq("id", palestraToDelete);

      if (error) throw error;

      toast({
        title: "🗑️ Palestra excluída com sucesso!",
      });

      fetchPalestras();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir palestra",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPalestraToDelete(null);
    }
  };

  const getStatusBadge = (status: Palestra['status']) => {
    const variants: Record<Palestra['status'], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      aguardando: { label: "Aguardando", variant: "outline" },
      processando: { label: "Processando", variant: "secondary" },
      concluido: { label: "Concluído", variant: "default" },
      erro: { label: "Erro", variant: "destructive" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getNivelBadge = (nivel: string | null) => {
    if (!nivel) return null;
    const labels: Record<string, string> = {
      junior: "Júnior",
      pleno: "Pleno",
      senior: "Sênior",
    };
    return <Badge variant="outline">{labels[nivel] || nivel}</Badge>;
  };

  const getFormatoBadge = (formato: string | null) => {
    if (!formato) return null;
    const labels: Record<string, string> = {
      completo: "Completo",
      compacto: "Compacto",
    };
    return <Badge variant="secondary">{labels[formato] || formato}</Badge>;
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/eventos")}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Eventos
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Palestras - {nomeEvento}
              </h2>
              <p className="text-muted-foreground mt-1">
                Gerencie as palestras deste evento
              </p>
            </div>
            <Button
              onClick={() => navigate(`/eventos/${eventoId}/palestras/nova`)}
              size="lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nova Palestra
            </Button>
          </div>
        </div>

        {/* Lista de Palestras */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : palestras.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma palestra cadastrada ainda.
              </p>
              <Button onClick={() => navigate(`/eventos/${eventoId}/palestras/nova`)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Primeira Palestra
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {palestras.map((palestra) => (
              <Card key={palestra.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{palestra.titulo}</CardTitle>
                      {palestra.palestrante && (
                        <CardDescription className="mt-1">
                          {palestra.palestrante}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(palestra.status)}
                    {getNivelBadge(palestra.nivel_escolhido)}
                    {getFormatoBadge(palestra.formato_escolhido)}
                  </div>

                  {palestra.tags_tema && palestra.tags_tema.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {palestra.tags_tema.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/eventos/${eventoId}/palestras/${palestra.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/eventos/${eventoId}/palestras/${palestra.id}/editar`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(palestra.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A palestra será permanentemente excluída.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default PalestrasList;
