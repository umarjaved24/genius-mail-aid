import { Email } from "@/types/email";

export const mockEmails: Email[] = [
  {
    id: "1",
    from: {
      name: "Sarah Chen",
      email: "sarah.chen@techcorp.com",
    },
    subject: "Q4 Product Roadmap Review",
    snippet: "Hi team, I've attached the updated Q4 roadmap with priorities for our AI features...",
    body: `Hi team,

I've attached the updated Q4 roadmap with priorities for our AI features. Here are the key highlights:

1. Email automation with GPT-5 integration
2. Smart categorization and filtering
3. Voice-to-email transcription
4. Real-time collaboration features

Let's schedule a sync next week to discuss implementation details. Please review the roadmap and share your feedback by Friday.

Looking forward to your thoughts!

Best,
Sarah`,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    category: "inbox",
    labels: ["work", "important"],
  },
  {
    id: "2",
    from: {
      name: "Marcus Rodriguez",
      email: "marcus@designstudio.io",
    },
    subject: "Design System Updates",
    snippet: "The new component library is ready for review. I've implemented the indigo theme you requested...",
    body: `Hey,

The new component library is ready for review. I've implemented the indigo theme you requested with these updates:

- Updated color tokens with HSL values
- New gradient variants for hero sections
- Improved dark mode contrast ratios
- Added glass-morphism effects

Check out the Figma file and let me know if you want any adjustments. The handoff is scheduled for next Monday.

Cheers,
Marcus`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    category: "inbox",
    labels: ["design"],
  },
  {
    id: "3",
    from: {
      name: "LinkedIn",
      email: "notifications@linkedin.com",
    },
    subject: "You have 3 new connection requests",
    snippet: "Alex Thompson, Jamie Lee, and Priya Patel want to connect with you...",
    body: `Hello,

You have 3 new connection requests from:

- Alex Thompson (Senior Product Manager at Google)
- Jamie Lee (UX Designer at Meta)
- Priya Patel (Engineering Lead at Amazon)

View and respond to these requests on LinkedIn.

Best regards,
The LinkedIn Team`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    category: "inbox",
    labels: ["social"],
  },
  {
    id: "4",
    from: {
      name: "Emma Watson",
      email: "emma@startup.ventures",
    },
    subject: "Investment Proposal - AI Email Platform",
    snippet: "We're impressed by your AI email automation platform and would like to discuss a Series A investment...",
    body: `Hi,

We're impressed by your AI email automation platform and would like to discuss a Series A investment opportunity.

Our fund has invested in similar communication tools like Superhuman and Front, and we see tremendous potential in what you're building.

Are you available for a call next week? We'd love to learn more about your vision and growth plans.

Best regards,
Emma Watson
Partner, Startup Ventures`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    category: "inbox",
    labels: ["business", "important"],
  },
  {
    id: "5",
    from: {
      name: "GitHub",
      email: "noreply@github.com",
    },
    subject: "[lovable-ai] Pull Request #42: AI Draft Generation",
    snippet: "David Kim opened a new pull request for review...",
    body: `A new pull request has been opened:

Title: AI Draft Generation with Streaming
Author: David Kim
Repository: lovable-ai/email-automation

Changes:
- Added Gemini 2.5 Flash integration
- Implemented streaming responses
- Created context-aware prompt system
- Added user preference handling

Please review and merge if the changes look good.`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    category: "inbox",
    labels: ["github"],
  },
];
