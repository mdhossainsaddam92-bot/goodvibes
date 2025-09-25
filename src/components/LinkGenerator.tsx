import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Copy, ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "./LanguageToggle";
import { useToast } from "@/hooks/use-toast";

interface LinkGeneratorProps {
  onBack: () => void;
  onViewDashboard: (username: string) => void;
}

export const LinkGenerator = ({ onBack, onViewDashboard }: LinkGeneratorProps) => {
  const [username, setUsername] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!username.trim()) return;
    
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    const link = `${window.location.origin}/${cleanUsername}`;
    setGeneratedLink(link);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        description: t.linkCopied,
        duration: 3000,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        description: t.linkCopied,
        duration: 3000,
      });
    }
  };

  const handleViewDashboard = () => {
    if (generatedLink) {
      const usernameFromLink = generatedLink.split('/').pop() || '';
      onViewDashboard(usernameFromLink);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
      
      <div className="max-w-md mx-auto w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <Card className="card-warm border-none">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl gradient-text">
              Generate Your Link ✨
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                {t.nameLabel}
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.namePlaceholder}
                className="bg-input/50 border-border/50 focus:bg-background transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={!username.trim()}
              className="w-full btn-gradient text-white font-semibold py-3"
            >
              {t.generateButton}
            </Button>

            {generatedLink && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your appreciation link:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-background/50 px-3 py-2 rounded border">
                      {generatedLink}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    className="flex-1 btn-gradient text-white font-semibold"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t.copyButton}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleViewDashboard}
                    className="shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};