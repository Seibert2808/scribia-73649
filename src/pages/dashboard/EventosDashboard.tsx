import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventList } from "@/components/dashboard/EventList";
import { EventForm } from "@/components/dashboard/EventForm";
import { Evento, EventoFormData } from "@/types/evento";
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

const EventosDashboard = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEventos();
    }
  }, [isAuthenticated, user]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scribia_eventos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setEventos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData: EventoFormData) => {
    try {
      setFormLoading(true);

      if (editingEvento) {
        // Update
        const { error } = await supabase
          .from("scribia_eventos")
          .update({
            ...formData,
            data_inicio: formData.data_inicio || null,
            data_fim: formData.data_fim || null,
            cidade: formData.cidade || null,
            estado: formData.estado || null,
            pais: formData.pais || null,
            observacoes: formData.observacoes || null,
          })
          .eq("id", editingEvento.id);

        if (error) throw error;

        toast({
          title: "✅ Evento atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create
        const { error } = await supabase
          .from("scribia_eventos")
          .insert({
            ...formData,
            usuario_id: user!.id,
            data_inicio: formData.data_inicio || null,
            data_fim: formData.data_fim || null,
            cidade: formData.cidade || null,
            estado: formData.estado || null,
            pais: formData.pais || null,
            observacoes: formData.observacoes || null,
          });

        if (error) throw error;

        toast({
          title: "✅ Evento criado com sucesso!",
          description: "Seu evento foi adicionado.",
        });
      }

      setFormOpen(false);
      setEditingEvento(null);
      fetchEventos();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar evento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setEventoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventoToDelete) return;

    try {
      const { error } = await supabase
        .from("scribia_eventos")
        .delete()
        .eq("id", eventoToDelete);

      if (error) throw error;

      toast({
        title: "🗑️ Evento excluído com sucesso!",
        description: "O evento foi removido.",
      });

      fetchEventos();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEventoToDelete(null);
    }
  };

  const handleNewEvent = () => {
    setEditingEvento(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, {profile?.nome_completo?.split(" ")[0] || "Usuário"}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie seus eventos e palestras
          </p>
        </div>
        <Button onClick={handleNewEvent} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Evento
        </Button>
      </div>

      {/* Event List */}
      <EventList
        eventos={eventos}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Event Form Dialog */}
      <EventForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingEvento(null);
        }}
        onSubmit={handleCreateOrUpdate}
        evento={editingEvento}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O evento será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventosDashboard;
