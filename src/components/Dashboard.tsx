import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Heart, Share, ArrowLeft, Download } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "./LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  message: string;
  created_at: string;
}

interface DashboardProps {
  username: string;
  onBack: () => void;
}

export const Dashboard = ({ username, onBack }: DashboardProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `username=eq.${username}`
        },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (message: string, platform: string) => {
    const shareText = `${t.socialShare} ${message}`;
    const shareUrl = `${window.location.origin}/${username}`;
    
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + shareUrl);
        toast({
          description: "Text copied for Instagram! Paste it in your story or post.",
          duration: 3000,
        });
        return;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
      <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
      
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {t.dashboard}
          </h1>
          <p className="text-muted-foreground">
            {t.receivedMessages.replace('❤️', '')} <span className="text-lg">❤️</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Share your link: <code className="bg-muted px-2 py-1 rounded text-xs">
              {window.location.origin}/{username}
            </code>
          </p>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card className="card-warm border-none">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💌</div>
                <p className="text-muted-foreground">
                  {t.noMessages}
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card key={msg.id} className="card-warm border-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed mb-3">
                        "{msg.message}"
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(msg.created_at)}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Share className="w-3 h-3 mr-1" />
                              {t.shareButton}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleShare(msg.message, 'facebook')}>
                              Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(msg.message, 'whatsapp')}>
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(msg.message, 'telegram')}>
                              Telegram
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(msg.message, 'linkedin')}>
                              LinkedIn
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(msg.message, 'instagram')}>
                              Instagram
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {messages.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" disabled className="bg-muted/50">
              <Download className="w-4 h-4 mr-2" />
              {t.exportButton}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};