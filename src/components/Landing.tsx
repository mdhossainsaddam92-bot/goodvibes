import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, MessageCircle, LogIn, LogOut } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageToggle } from "./LanguageToggle";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface LandingProps {
  onNext: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
}

export const Landing = ({ onNext, user, onSignOut }: LandingProps) => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LanguageToggle onLanguageChange={setLanguage} currentLang={language} />
      
      <div className="absolute top-4 right-4 flex gap-2">
        {user ? (
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate('/auth')}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
      
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 text-4xl animate-pulse">✨</div>
        <div className="absolute top-32 right-1/4 text-3xl animate-bounce">💖</div>
        <div className="absolute bottom-32 left-1/3 text-2xl animate-pulse">🌟</div>
        
        {/* Main content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text animate-fade-in">
            {t.heading}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Card className="card-warm border-none">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Anonymous</h3>
              <p className="text-sm text-muted-foreground">Share positive thoughts without revealing identity</p>
            </CardContent>
          </Card>
          
          <Card className="card-warm border-none">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Positive Only</h3>
              <p className="text-sm text-muted-foreground">A space dedicated to spreading good vibes</p>
            </CardContent>
          </Card>
          
          <Card className="card-warm border-none">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">Generate and share your appreciation link instantly</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onNext}
          size="lg"
          className="btn-gradient text-white px-8 py-6 text-lg font-semibold rounded-full mt-8"
        >
          {user ? "View My Dashboard" : t.createButton}
        </Button>
      </div>
    </div>
  );
};