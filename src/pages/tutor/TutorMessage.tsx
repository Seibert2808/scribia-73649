import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TutorMessageProps {
  type: "user" | "tutor";
  message: string;
  timestamp: Date;
}

export function TutorMessage({ type, message, timestamp }: TutorMessageProps) {
  const isUser = type === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? "bg-primary" : "bg-secondary"
      }`}>
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-secondary-foreground" />
        )}
      </div>
      
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(timestamp, "HH:mm", { locale: ptBR })}
        </span>
      </div>
    </div>
  );
}
