import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Email } from "@/types/email";
import { useToast } from "@/hooks/use-toast";

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmails();
    setupRealtimeSubscription();
  }, []);

  const fetchEmails = async () => {
    try {
      const { data: accountData } = await supabase
        .from("email_accounts")
        .select("id")
        .single();

      if (!accountData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("account_id", accountData.id)
        .order("received_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setEmails(
          data.map((email) => ({
            id: email.id,
            from: {
              name: email.from_name || email.from_email,
              email: email.from_email,
            },
            subject: email.subject || "(No Subject)",
            snippet: email.snippet || "",
            body: email.body || "",
            timestamp: new Date(email.received_at),
            isRead: email.is_read,
            isStarred: email.is_starred,
            hasAttachments: email.has_attachments,
            category: email.category as any,
            labels: email.labels || [],
          }))
        );
      }
    } catch (error: any) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("emails-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emails",
        },
        () => {
          fetchEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const toggleStar = async (emailId: string) => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;

    // Optimistic update
    setEmails(
      emails.map((e) =>
        e.id === emailId ? { ...e, isStarred: !e.isStarred } : e
      )
    );

    try {
      const { error } = await supabase
        .from("emails")
        .update({ is_starred: !email.isStarred })
        .eq("id", emailId);

      if (error) throw error;
    } catch (error: any) {
      // Revert on error
      setEmails(
        emails.map((e) =>
          e.id === emailId ? { ...e, isStarred: email.isStarred } : e
        )
      );
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update({ is_read: true })
        .eq("id", emailId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error marking email as read:", error);
    }
  };

  return { emails, loading, toggleStar, markAsRead, refetch: fetchEmails };
}
