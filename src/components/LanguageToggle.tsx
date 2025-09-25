import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";

interface LanguageToggleProps {
  onLanguageChange: (lang: 'en' | 'bn') => void;
  currentLang: 'en' | 'bn';
}

export const LanguageToggle = ({ onLanguageChange, currentLang }: LanguageToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onLanguageChange(currentLang === 'en' ? 'bn' : 'en')}
      className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm"
    >
      <Globe className="w-4 h-4 mr-2" />
      {currentLang === 'en' ? 'বাংলা' : 'English'}
    </Button>
  );
};