import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Get user's profile with Gmail token
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("gmail_token")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.gmail_token) {
      throw new Error("Gmail not connected");
    }

    const gmailToken = profile.gmail_token as any;

    // Get user's email account
    const { data: account } = await supabaseClient
      .from("email_accounts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!account) {
      throw new Error("No email account found");
    }

    // Fetch emails from Gmail API
    const gmailResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=in:inbox",
      {
        headers: {
          Authorization: `Bearer ${gmailToken.access_token}`,
        },
      }
    );

    if (!gmailResponse.ok) {
      throw new Error("Failed to fetch emails from Gmail");
    }

    const gmailData = await gmailResponse.json();
    const messages = gmailData.messages || [];

    console.log(`Syncing ${messages.length} emails`);

    // Fetch full details for each message
    for (const message of messages) {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Bearer ${gmailToken.access_token}`,
          },
        }
      );

      if (!detailResponse.ok) continue;

      const detail = await detailResponse.json();
      const headers = detail.payload.headers;

      const from = headers.find((h: any) => h.name === "From")?.value || "";
      const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
      const date = headers.find((h: any) => h.name === "Date")?.value || "";

      // Extract email and name from "Name <email@example.com>" format
      const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/);
      const fromName = fromMatch ? fromMatch[1].trim() : from;
      const fromEmail = fromMatch ? fromMatch[2].trim() : from;

      // Get email body
      let body = detail.snippet || "";
      if (detail.payload.body?.data) {
        body = atob(detail.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }

      // Check if email already exists
      const { data: existing } = await supabaseClient
        .from("emails")
        .select("id")
        .eq("gmail_id", message.id)
        .single();

      if (!existing) {
        // Insert new email
        await supabaseClient.from("emails").insert({
          account_id: account.id,
          gmail_id: message.id,
          thread_id: detail.threadId,
          from_email: fromEmail,
          from_name: fromName,
          subject,
          snippet: detail.snippet,
          body,
          labels: detail.labelIds || [],
          category: detail.labelIds?.includes("INBOX") ? "inbox" : "sent",
          is_read: !detail.labelIds?.includes("UNREAD"),
          is_starred: detail.labelIds?.includes("STARRED") || false,
          has_attachments: detail.payload.parts?.some((p: any) => p.filename) || false,
          received_at: new Date(date).toISOString(),
        });
      }
    }

    // Update last synced timestamp
    await supabaseClient
      .from("email_accounts")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", account.id);

    return new Response(
      JSON.stringify({ success: true, synced: messages.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
