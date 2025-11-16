import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Palestra } from "@/types/palestra";

interface EditPalestraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palestra: Palestra;
  onSuccess: () => void;
}

export function EditPalestraDialog({ open, onOpenChange, palestra, onSuccess }: EditPalestraDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: palestra.titulo,
    palestrante: palestra.palestrante || "",
    tags_tema: palestra.tags_tema || [],
  });
  const [currentTag, setCurrentTag] = useState("");

  // Resetar form quando palestra mudar
  useEffect(() => {
    setFormData({
      titulo: palestra.titulo,
      palestrante: palestra.palestrante || "",
      tags_tema: palestra.tags_tema || [],
    });
    setCurrentTag("");
  }, [palestra]);

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags_tema.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags_tema: [...formData.tags_tema, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags_tema: formData.tags_tema.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async () => {
    if (!formData.titulo.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    try {
      setLoading(true);
      
      const userId = localStorage.getItem('scribia_user_id');
      if (!userId) {
        toast.error("Usuário não autenticado");
        return;
      }

      const { data, error } = await supabase.rpc('scribia_update_palestra', {
        p_palestra_id: palestra.id,
        p_usuario_id: userId,
        p_titulo: formData.titulo.trim(),
        p_palestrante: formData.palestrante.trim() || null,
        p_tags_tema: formData.tags_tema.length > 0 ? formData.tags_tema : null,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        throw new Error(result.error || 'Erro ao atualizar palestra');
      }

      toast.success("Palestra atualizada com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar palestra:', error);
      toast.error(error.message || "Erro ao atualizar palestra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Palestra</DialogTitle>
          <DialogDescription>
            Altere as informações básicas da palestra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Digite o título da palestra"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="palestrante">Palestrante</Label>
            <Input
              id="palestrante"
              value={formData.palestrante}
              onChange={(e) => setFormData({ ...formData, palestrante: e.target.value })}
              placeholder="Nome do palestrante (opcional)"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tags/Temas</Label>
            <div className="flex gap-2">
              <Input
                id="tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Digite uma tag e pressione Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Adicionar
              </Button>
            </div>

            {formData.tags_tema.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags_tema.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
