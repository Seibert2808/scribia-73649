import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/dashboard/PageLayout";
import { LivebookCard } from "./LivebookCard";
import { LivebookProgress } from "./LivebookProgress";
import { LivebookWithPalestra } from "@/types/livebook";
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

const LivebooksList = () => {
  const { eventoId } = useParams<{ eventoId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [livebooks, setLivebooks] = useState<LivebookWithPalestra[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [livebookToDelete, setLivebookToDelete] = useState<string | null>(null);
  const [nomeEvento, setNomeEvento] = useState("");

  useEffect(() => {
    if (user) {
      if (eventoId) {
        fetchEvento();
      }
      fetchLivebooks();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'scribia_livebooks',
            filter: `usuario_id=eq.${user.id}`,
          },
          () => {
            fetchLivebooks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, eventoId]);

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

  const fetchLivebooks = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("scribia_livebooks")
        .select(`
          *,
          palestra:scribia_palestras!inner(
            titulo,
            nivel_escolhido,
            formato_escolhido,
            evento_id
          )
        `)
        .order("criado_em", { ascending: false });

      // Filter by event if specified
      if (eventoId) {
        query = query.eq('palestra.evento_id', eventoId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setLivebooks(data as unknown as LivebookWithPalestra[] || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar livebooks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setLivebookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!livebookToDelete) return;

    try {
      const { error } = await supabase
        .from("scribia_livebooks")
        .delete()
        .eq("id", livebookToDelete);

      if (error) throw error;

      toast({
        title: "🗑️ Livebook excluído com sucesso!",
      });

      fetchLivebooks();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir livebook",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setLivebookToDelete(null);
    }
  };

  const processingLivebooks = livebooks.filter(
    (lb) => lb.status === 'aguardando' || lb.status === 'transcrevendo' || lb.status === 'processando'
  );

  const completedLivebooks = livebooks.filter(
    (lb) => lb.status === 'concluido' || lb.status === 'erro'
  );

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          {eventoId && (
            <Button
              variant="ghost"
              onClick={() => navigate(`/eventos/${eventoId}/palestras`)}
              className="w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Palestras
            </Button>
          )}

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Livebooks {nomeEvento && `- ${nomeEvento}`}
            </h2>
            <p className="text-muted-foreground mt-1">
              Seus resumos gerados automaticamente
            </p>
          </div>
        </div>

        {/* Em processamento */}
        {processingLivebooks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Em Processamento</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processingLivebooks.map((livebook) => (
                <LivebookProgress
                  key={livebook.id}
                  status={livebook.status}
                  titulo={livebook.palestra.titulo}
                  erro={livebook.erro_log}
                />
              ))}
            </div>
          </div>
        )}

        {/* Concluídos */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : completedLivebooks.length === 0 && processingLivebooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum livebook gerado ainda.
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Os livebooks serão gerados automaticamente após fazer upload de áudio nas palestras.
              </p>
            </CardContent>
          </Card>
        ) : (
          completedLivebooks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Concluídos</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedLivebooks.map((livebook) => (
                  <LivebookCard
                    key={livebook.id}
                    livebook={livebook}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O livebook será permanentemente excluído.
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

export default LivebooksList;
