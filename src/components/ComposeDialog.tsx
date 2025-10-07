import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: {
    email: string;
    subject: string;
    body: string;
  };
}

export function ComposeDialog({ open, onOpenChange, replyTo }: ComposeDialogProps) {
  const { toast } = useToast();
  const [to, setTo] = useState(replyTo?.email || "");
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : "");
  const [body, setBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleAIGenerate = async () => {
    if (!replyTo && !customPrompt) {
      toast({
        title: "Need context",
        description: "Please provide a prompt or reply to an existing email",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with streaming effect
    const sampleResponse = `Thank you for your email${replyTo ? ` regarding ${replyTo.subject}` : ''}.

I appreciate you reaching out${customPrompt ? ` about ${customPrompt}` : ''}. Let me address your points:

${replyTo ? `Regarding your message about ${replyTo.subject.toLowerCase()}, I've reviewed the details and here are my thoughts:` : ''}

I look forward to discussing this further. Please let me know if you have any questions or need additional information.

Best regards`;

    // Simulate streaming by typing effect
    let currentText = "";
    const words = sampleResponse.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + " ";
      setBody(currentText);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsGenerating(false);
    
    toast({
      title: "Draft generated",
      description: "AI has generated your email draft. Feel free to edit before sending.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Email sent",
      description: "Your email has been sent successfully.",
    });
    onOpenChange(false);
    setTo("");
    setSubject("");
    setBody("");
    setCustomPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {replyTo ? "AI Reply" : "Compose with AI"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {!replyTo && (
            <div className="space-y-2">
              <Label htmlFor="prompt">AI Prompt (Optional)</Label>
              <Input
                id="prompt"
                placeholder="e.g., Write a follow-up about our meeting"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Message</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAIGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="body"
              placeholder="Type your message or use AI to generate..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!to || !subject || !body}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
