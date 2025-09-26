import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "./LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageFormProps {
  username: string;
}

export const MessageForm = ({ username }: MessageFormProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            username: username,
            message: message.trim()
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      setMessage("");
      
      toast({
        description: t.successMessage,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
        
        <div className="max-w-md mx-auto text-center">
          <Card className="card-warm border-none">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold gradient-text mb-4">
                {t.successMessage}
              </h2>
              <p className="text-muted-foreground mb-6">
                Your positive message has brightened someone's day!
              </p>
              <Button
                onClick={handleSendAnother}
                className="btn-gradient text-white font-semibold"
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
      
      <div className="max-w-md mx-auto w-full">
        <Card className="card-warm border-none">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl gradient-text">
                {t.writeMessage} {t.for} {username} 💌
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="min-h-32 bg-input/50 border-border/50 focus:bg-background transition-colors resize-none"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{message.length}/500</span>
                <span>✨ Spread positivity</span>
              </div>

              <Button 
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="w-full btn-gradient text-white font-semibold py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.sendButton}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};