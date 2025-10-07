import { Email } from "@/types/email";
import { formatDistanceToNow } from "date-fns";
import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (email: Email) => void;
  onToggleStar: (emailId: string) => void;
}

export function EmailList({ emails, selectedEmailId, onEmailSelect, onToggleStar }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>No emails to display</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {emails.map((email) => {
        const isSelected = selectedEmailId === email.id;
        
        return (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={cn(
              "border-b border-border px-6 py-4 cursor-pointer transition-all hover:bg-muted/50",
              isSelected && "bg-muted border-l-4 border-l-primary",
              !email.isRead && "bg-primary/5"
            )}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(email.id);
                }}
                className="mt-1"
              >
                <Star
                  className={cn(
                    "w-4 h-4 transition-colors",
                    email.isStarred
                      ? "fill-accent text-accent"
                      : "text-muted-foreground hover:text-accent"
                  )}
                />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={cn(
                    "font-semibold text-sm truncate",
                    !email.isRead && "text-foreground font-bold"
                  )}>
                    {email.from.name}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(email.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <p className={cn(
                  "text-sm mb-1 truncate",
                  !email.isRead ? "font-semibold text-foreground" : "text-foreground/80"
                )}>
                  {email.subject}
                </p>
                
                <p className="text-sm text-muted-foreground truncate">
                  {email.snippet}
                </p>
                
                {email.hasAttachments && (
                  <div className="flex items-center gap-1 mt-2">
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Attachment</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
