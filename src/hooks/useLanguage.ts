import { useState } from 'react';

export type Language = 'en' | 'bn';

export const translations = {
  en: {
    heading: "Only Positive Vibes ✨",
    subheading: "Spread joy and appreciation anonymously",
    createButton: "Create My Appreciation Link",
    nameLabel: "Your Name/Username",
    namePlaceholder: "Enter your name (e.g., hossain)",
    generateButton: "Generate Link",
    copyButton: "Copy Link & Share",
    linkCopied: "Link copied to clipboard! ✅",
    writeMessage: "Write something positive",
    messagePlaceholder: "Share your appreciation...",
    sendButton: "Send",
    successMessage: "Your appreciation has been sent ✅",
    dashboard: "Dashboard",
    receivedMessages: "Messages for you ❤️",
    shareButton: "Share with Social Media",
    exportButton: "Export (Coming Soon 🚀)",
    socialShare: "I have received some positive messages ❤️\nYou can also write me:",
    hashtags: "#PositiveVibes #Appreciation",
    back: "← Back",
    noMessages: "No messages yet. Share your link to receive positive vibes!",
    for: "for"
  },
  bn: {
    heading: "শুধু ইতিবাচক ভাইব ✨",
    subheading: "গোপনীয়ভাবে আনন্দ এবং কৃতজ্ঞতা ছড়িয়ে দিন",
    createButton: "আমার কৃতজ্ঞতা লিংক তৈরি করুন",
    nameLabel: "আপনার নাম/ইউজারনেম",
    namePlaceholder: "আপনার নাম লিখুন (যেমন: হোসেন)",
    generateButton: "লিংক তৈরি করুন",
    copyButton: "লিংক কপি করুন ও শেয়ার করুন",
    linkCopied: "লিংক কপি হয়েছে! ✅",
    writeMessage: "কিছু ইতিবাচক লিখুন",
    messagePlaceholder: "আপনার কৃতজ্ঞতা শেয়ার করুন...",
    sendButton: "পাঠান",
    successMessage: "আপনার কৃতজ্ঞতা পাঠানো হয়েছে ✅",
    dashboard: "ড্যাশবোর্ড",
    receivedMessages: "আপনার জন্য বার্তা ❤️",
    shareButton: "সামাজিক মাধ্যমে শেয়ার করুন",
    exportButton: "এক্সপোর্ট (শীঘ্রই আসছে 🚀)",
    socialShare: "আমি কিছু ইতিবাচক বার্তা পেয়েছি ❤️\nআপনিও আমাকে লিখতে পারেন:",
    hashtags: "#ইতিবাচকভাইব #কৃতজ্ঞতা",
    back: "← ফিরে যান",
    noMessages: "এখনো কোনো বার্তা নেই। ইতিবাচক ভাইব পেতে আপনার লিংক শেয়ার করুন!",
    for: "এর জন্য"
  }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];
  
  return {
    language,
    setLanguage,
    t
  };
};