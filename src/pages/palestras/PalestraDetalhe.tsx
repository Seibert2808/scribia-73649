import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { LivebookProgress } from "@/pages/livebooks/LivebookProgress";
import { LivebookCard } from "@/pages/livebooks/LivebookCard";
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

const PalestraDetalhe = () => {
  const { eventoId, palestraId } = useParams<{ eventoId: string; palestraId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useCustomAuth();

  const [livebooks, setLivebooks] = useState<LivebookWithPalestra[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [livebookToDelete, setLivebookToDelete] = useState<string | null>(null);
  const [palestraTitulo, setPalestraTitulo] = useState("");

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate("/login");
      return;
    }
    
    if (palestraId && user?.profile?.id) {
      fetchLivebooks();
    }
  }, [palestraId, user, authLoading, navigate]);

  const fetchLivebooks = async () => {
    if (!user?.profile?.id) return;

    try {
      setLoading(true);

      // Buscar livebooks usando RPC function com SECURITY DEFINER
      const { data: result } = await supabase.rpc('scribia_get_livebooks_by_palestra', {
        p_palestra_id: palestraId!,
        p_usuario_id: user.profile.id
      });

      const response = result as { success: boolean; error?: string; data?: any[] };

      if (response?.success) {
        const livebooksData = response.data || [];
        setLivebooks(livebooksData);

        // Definir título da palestra
        if (livebooksData.length > 0) {
          setPalestraTitulo(livebooksData[0].palestra?.titulo || 'Palestra');
        } else {
          // Se não houver livebooks, buscar título da palestra
          const { data: palestraResult } = await supabase.rpc('scribia_get_palestra', {
            p_palestra_id: palestraId!,
            p_usuario_id: user.profile.id
          });

          const palestraResponse = palestraResult as { success: boolean; error?: string; data?: any };
          if (palestraResponse?.success && palestraResponse.data) {
            setPalestraTitulo(palestraResponse.data.titulo);
          }
        }
      } else {
        console.error('Erro ao buscar livebooks:', response?.error);
        throw new Error(response?.error || 'Erro ao buscar livebooks');
      }

      // Realtime subscription
      const channel = supabase
        .channel('palestra-livebooks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'scribia_livebooks',
            filter: `palestra_id=eq.${palestraId}`,
          },
          () => {
            fetchLivebooks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error: any) {
      console.error("Erro ao buscar livebooks:", error);
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

    if (!user?.profile?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível identificar o usuário",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: result, error } = await supabase.rpc('scribia_delete_livebook', {
        p_livebook_id: livebookToDelete,
        p_usuario_id: user.profile.id
      });

      if (error) throw error;

      const response = result as { success: boolean; error?: string; message?: string };

      if (!response?.success) {
        throw new Error(response?.error || 'Erro ao excluir livebook');
      }

      // Atualizar UI imediatamente removendo o livebook do estado local
      setLivebooks(prev => prev.filter(lb => lb.id !== livebookToDelete));

      toast({
        title: "🗑️ Livebook excluído com sucesso!",
      });

      // Buscar dados atualizados do servidor em background
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

  if (authLoading || loading) {
    return (
      <div className="p-4 sm:p-6 py-6 space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
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
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/eventos/${eventoId}/palestras`)}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Palestras
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Livebooks - {palestraTitulo}
              </h2>
              <p className="text-muted-foreground mt-1">
                Gerencie os livebooks desta palestra
              </p>
            </div>
            
            <Button 
              onClick={() => navigate(`/dashboard/palestras/${palestraId}/livebooks/novo`)}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Livebook
            </Button>
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
        {completedLivebooks.length === 0 && processingLivebooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum livebook gerado ainda para esta palestra.
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                Crie um novo livebook para gerar resumos personalizados desta palestra.
              </p>
              <Button onClick={() => navigate(`/dashboard/palestras/${palestraId}/livebooks/novo`)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Livebook
              </Button>
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
  );
};

export default PalestraDetalhe;
