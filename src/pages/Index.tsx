import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { ComposeDialog } from "@/components/ComposeDialog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { mockEmails } from "@/data/mockEmails";
import { Email, AIPreferences } from "@/types/email";

const Index = () => {
  const [activeView, setActiveView] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState(mockEmails);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ email: string; subject: string; body: string } | undefined>();
  const [preferences, setPreferences] = useState<AIPreferences>({
    tone: "professional",
    length: "medium",
    context: "",
    autoDraft: true,
  });

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedEmail(null);
    
    if (view === "compose") {
      setReplyTo(undefined);
      setComposeOpen(true);
    }
  };

  const handleToggleStar = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read
    setEmails(emails.map(e =>
      e.id === email.id ? { ...e, isRead: true } : e
    ));
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
            <h2 className="text-2xl font-bold capitalize">{activeView}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredEmails.length} {filteredEmails.length === 1 ? "email" : "emails"}
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
