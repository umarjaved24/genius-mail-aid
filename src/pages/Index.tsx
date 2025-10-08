import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { ComposeDialog } from "@/components/ComposeDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Email, AIPreferences } from "@/types/email";
import { useAuth } from "@/hooks/useAuth";
import { useEmails } from "@/hooks/useEmails";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { emails, loading: emailsLoading, toggleStar, markAsRead, refetch } = useEmails();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ email: string; subject: string; body: string } | undefined>();
  const [syncing, setSyncing] = useState(false);
  const [preferences, setPreferences] = useState<AIPreferences>({
    tone: "professional",
    length: "medium",
    context: "",
    autoDraft: true,
  });

  // Sync emails on mount
  useEffect(() => {
    if (user && !authLoading) {
      syncEmails();
    }
  }, [user, authLoading]);

  const syncEmails = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("gmail-sync");
      if (error) throw error;
      toast({
        title: "Emails synced",
        description: `Synced ${data?.synced || 0} emails`,
      });
      refetch();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedEmail(null);
    
    if (view === "compose") {
      setReplyTo(undefined);
      setComposeOpen(true);
    }
  };

  const handleToggleStar = (emailId: string) => {
    toggleStar(emailId);
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    markAsRead(email.id);
  };

  const handleReply = () => {
    if (selectedEmail) {
      setReplyTo({
        email: selectedEmail.from.email,
        subject: selectedEmail.subject,
        body: selectedEmail.body,
      });
      setComposeOpen(true);
    }
  };

  const getFilteredEmails = () => {
    switch (activeView) {
      case "inbox":
        return emails.filter(e => e.category === "inbox");
      case "starred":
        return emails.filter(e => e.isStarred);
      case "sent":
        return emails.filter(e => e.category === "sent");
      case "drafts":
        return emails.filter(e => e.category === "draft");
      case "trash":
        return emails.filter(e => e.category === "trash");
      default:
        return emails;
    }
  };

  const unreadCount = emails.filter(e => !e.isRead && e.category === "inbox").length;
  const filteredEmails = getFilteredEmails();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (activeView === "settings") {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          unreadCount={unreadCount}
        />
        <SettingsPanel
          preferences={preferences}
          onPreferencesChange={setPreferences}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        unreadCount={unreadCount}
      />
      
      <div className="flex-1 flex border-r border-border">
        <div className="w-96 border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold capitalize">{activeView}</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={syncEmails}
                disabled={syncing}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {emailsLoading ? "Loading..." : `${filteredEmails.length} ${filteredEmails.length === 1 ? "email" : "emails"}`}
            </p>
          </div>
          <EmailList
            emails={filteredEmails}
            selectedEmailId={selectedEmail?.id || null}
            onEmailSelect={handleEmailSelect}
            onToggleStar={handleToggleStar}
          />
        </div>

        <EmailViewer
          email={selectedEmail}
          onToggleStar={handleToggleStar}
          onReply={handleReply}
        />
      </div>

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        replyTo={replyTo}
      />
    </div>
  );
};

export default Index;
