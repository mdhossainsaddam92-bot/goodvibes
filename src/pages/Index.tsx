import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Landing } from "@/components/Landing";
import { LinkGenerator } from "@/components/LinkGenerator";
import { MessageForm } from "@/components/MessageForm";
import { Dashboard } from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type View = 'landing' | 'generator' | 'dashboard';

const Index = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // If URL has username, show message form
  if (username) {
    return <MessageForm username={username} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleViewDashboard = () => {
    if (!user || !userProfile) {
      navigate('/auth');
      return;
    }
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
  };

  switch (currentView) {
    case 'generator':
      return (
        <LinkGenerator 
          onBack={() => setCurrentView('landing')}
          onViewDashboard={handleViewDashboard}
          user={user}
          userProfile={userProfile}
          onSignOut={handleSignOut}
        />
      );
    case 'dashboard':
      if (!user || !userProfile) {
        navigate('/auth');
        return null;
      }
      return (
        <Dashboard 
          username={userProfile.username}
          onBack={() => setCurrentView('generator')}
          onSignOut={handleSignOut}
        />
      );
    default:
      return (
        <Landing 
          onNext={() => setCurrentView('generator')} 
          user={user}
          onSignOut={handleSignOut}
        />
      );
  }
};

export default Index;
