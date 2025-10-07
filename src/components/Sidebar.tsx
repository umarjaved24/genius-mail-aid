import { Inbox, Send, FileText, Star, Trash2, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  unreadCount: number;
}

export function Sidebar({ activeView, onViewChange, unreadCount }: SidebarProps) {
  const menuItems = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: unreadCount },
    { id: "starred", label: "Starred", icon: Star },
    { id: "drafts", label: "Drafts", icon: FileText },
    { id: "sent", label: "Sent", icon: Send },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Mail
          </h1>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow"
          onClick={() => onViewChange("compose")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Compose
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && item.count > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => onViewChange("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeView === "settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
