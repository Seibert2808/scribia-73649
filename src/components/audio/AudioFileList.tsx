import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Mic, Trash2 } from "lucide-react";

interface AudioFileListProps {
  files: File[];
  blobs: Array<{ blob: Blob; duration: number; name: string }>;
  onRemoveFile: (index: number) => void;
  onRemoveBlob: (index: number) => void;
}

export const AudioFileList = ({ files, blobs, onRemoveFile, onRemoveBlob }: AudioFileListProps) => {
  if (files.length === 0 && blobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Arquivos de upload */}
      {files.map((file, index) => (
        <Card key={`file-${index}`} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveFile(index)}
              type="button"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}

      {/* Gravações */}
      {blobs.map((blob, index) => (
        <Card key={`blob-${index}`} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{blob.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(blob.duration / 60)}min {blob.duration % 60}s
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveBlob(index)}
              type="button"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
