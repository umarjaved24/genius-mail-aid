import { useState } from "react";
import { AIPreferences } from "@/types/email";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  preferences: AIPreferences;
  onPreferencesChange: (preferences: AIPreferences) => void;
}

export function SettingsPanel({ preferences, onPreferencesChange }: SettingsPanelProps) {
  const { toast } = useToast();
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleSave = () => {
    onPreferencesChange(localPreferences);
    toast({
      title: "Settings saved",
      description: "Your AI preferences have been updated successfully.",
    });
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-gradient-subtle">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Settings</h1>
            <p className="text-muted-foreground">Customize how AI generates your emails</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Writing Tone</CardTitle>
            <CardDescription>
              Choose the tone for AI-generated emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={localPreferences.tone}
              onValueChange={(value) =>
                setLocalPreferences({ ...localPreferences, tone: value as AIPreferences["tone"] })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional" className="font-normal cursor-pointer">
                  Professional - Formal and business-appropriate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual" className="font-normal cursor-pointer">
                  Casual - Relaxed and conversational
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly" className="font-normal cursor-pointer">
                  Friendly - Warm and approachable
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Length</CardTitle>
            <CardDescription>
              Preferred length for AI-generated responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={localPreferences.length}
              onValueChange={(value) =>
                setLocalPreferences({ ...localPreferences, length: value as AIPreferences["length"] })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short" className="font-normal cursor-pointer">
                  Short - Brief and concise (1-2 paragraphs)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal cursor-pointer">
                  Medium - Balanced length (3-4 paragraphs)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long" className="font-normal cursor-pointer">
                  Long - Detailed and comprehensive (5+ paragraphs)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Context</CardTitle>
            <CardDescription>
              Additional context for AI to consider when generating emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., I'm a product manager at a tech startup. Always mention availability for follow-up calls..."
              value={localPreferences.context}
              onChange={(e) =>
                setLocalPreferences({ ...localPreferences, context: e.target.value })
              }
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-Generate Drafts</CardTitle>
            <CardDescription>
              Automatically generate AI drafts for incoming emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable auto-generation</Label>
                <p className="text-sm text-muted-foreground">
                  AI will create draft replies in the background
                </p>
              </div>
              <Switch
                checked={localPreferences.autoDraft}
                onCheckedChange={(checked) =>
                  setLocalPreferences({ ...localPreferences, autoDraft: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
