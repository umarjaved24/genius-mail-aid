import { Email } from "@/types/email";
import { formatDistanceToNow } from "date-fns";
import { Star, Reply, Forward, Trash2, Archive, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailViewerProps {
  email: Email | null;
  onToggleStar: (emailId: string) => void;
  onReply: () => void;
}

export function EmailViewer({ email, onToggleStar, onReply }: EmailViewerProps) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-hero">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI-Powered Email</h2>
          <p className="text-muted-foreground">
            Select an email to view or compose a new message with AI assistance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{email.subject}</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{email.from.name}</span>
              <span className="text-muted-foreground">&lt;{email.from.email}&gt;</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(email.timestamp, { addSuffix: true })}
            </p>
          </div>
          
          <button
            onClick={() => onToggleStar(email.id)}
            className="mt-1"
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                email.isStarred
                  ? "fill-accent text-accent"
                  : "text-muted-foreground hover:text-accent"
              )}
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onReply}
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Reply
          </Button>
          <Button size="sm" variant="outline">
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button size="sm" variant="outline">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
          <div className="flex-1" />
          <Button size="sm" variant="outline">
            <Archive className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-sm max-w-none">
          {email.body.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
