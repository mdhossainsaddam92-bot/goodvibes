import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, LogOut } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "./LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface LinkGeneratorProps {
  onBack: () => void;
  onViewDashboard: () => void;
  user: User | null;
  userProfile: { username: string } | null;
  onSignOut: () => Promise<void>;
}

export const LinkGenerator = ({ onBack, onViewDashboard, user, userProfile, onSignOut }: LinkGeneratorProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const generatedLink = userProfile ? `${window.location.origin}/${userProfile.username}` : '';

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
      
      <div className="absolute top-4 right-4">
        {user && (
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
      
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
              Your Appreciation Link ✨
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {userProfile ? (
              <>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Share this link to receive positive messages:</p>
                  <div className="bg-background/50 px-3 py-2 rounded border">
                    <code className="text-sm font-mono break-all">
                      {generatedLink}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    className="flex-1 btn-gradient text-white font-semibold"
                  >
                    Copy Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onViewDashboard}
                    className="shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You need to sign in to create your appreciation link.
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="btn-gradient text-white font-semibold"
                >
                  Sign In to Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};