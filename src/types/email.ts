export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  snippet: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  category: "inbox" | "sent" | "draft" | "starred" | "trash";
  labels: string[];
}

export interface Draft {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  generatedByAI: boolean;
}

export interface AIPreferences {
  tone: "professional" | "casual" | "friendly";
  length: "short" | "medium" | "long";
  context: string;
  autoDraft: boolean;
}
