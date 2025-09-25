import { useState } from "react";
import { useParams } from "react-router-dom";
import { Landing } from "@/components/Landing";
import { LinkGenerator } from "@/components/LinkGenerator";
import { MessageForm } from "@/components/MessageForm";
import { Dashboard } from "@/components/Dashboard";

type View = 'landing' | 'generator' | 'dashboard';

const Index = () => {
  const { username } = useParams();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentUsername, setCurrentUsername] = useState<string>('');

  // If URL has username, show message form
  if (username) {
    return <MessageForm username={username} />;
  }

  const handleViewDashboard = (username: string) => {
    setCurrentUsername(username);
    setCurrentView('dashboard');
  };

  switch (currentView) {
    case 'generator':
      return (
        <LinkGenerator 
          onBack={() => setCurrentView('landing')}
          onViewDashboard={handleViewDashboard}
        />
      );
    case 'dashboard':
      return (
        <Dashboard 
          username={currentUsername}
          onBack={() => setCurrentView('generator')}
        />
      );
    default:
      return (
        <Landing onNext={() => setCurrentView('generator')} />
      );
  }
};

export default Index;
