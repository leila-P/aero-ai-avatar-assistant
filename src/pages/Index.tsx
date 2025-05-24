
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import AIAvatar from "@/components/AIAvatar";
import UserDetection from "@/components/UserDetection";
import BookingForm from "@/components/BookingForm";
import { Play, Mic, MicOff } from "lucide-react";

const Index = () => {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [userDetected, setUserDetected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartConversation = () => {
    setIsIntroPlaying(false);
    setShowAIAssistant(true);
  };

  const handleUserDetected = () => {
    setUserDetected(true);
    setTimeout(() => {
      setIsIntroPlaying(false);
      setShowAIAssistant(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* User Detection Component */}
      <UserDetection onUserDetected={handleUserDetected} />

      {isIntroPlaying ? (
        /* Intro Video Section */
        <div className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Video Background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23111827'/%3E%3C/svg%3E"
          >
            <source src="/intro-video.mp4" type="video/mp4" />
          </video>

          {/* Intro Content */}
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8 inline-block">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-fade-in">
              دستیار هوش مصنوعی پرواز
            </h1>
            
            <p className="text-xl mb-8 text-gray-300 animate-fade-in delay-500">
              من آینده رزرو بلیط هواپیما هستم. با من گفتگو کنید و بهترین پرواز را پیدا کنید
            </p>
            
            <div className="space-y-4 animate-fade-in delay-1000">
              <Button 
                onClick={handleStartConversation}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                شروع گفتگو
              </Button>
              
              <p className="text-sm text-gray-400">
                یا فقط در برابر دوربین بایستید تا گفتگو آغاز شود
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-cyan-400 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
        </div>
      ) : showAIAssistant ? (
        /* AI Assistant Section */
        <div className="flex h-screen">
          {/* AI Avatar Section */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <AIAvatar 
              isListening={isListening}
              conversation={conversation}
              onConversationUpdate={setConversation}
            />
          </div>

          {/* Booking Form Section */}
          <div className="w-1/2 p-8 overflow-y-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                اطلاعات رزرو پرواز
              </h2>
              <BookingForm 
                conversation={conversation}
                onUpdateConversation={setConversation}
              />
            </div>
          </div>

          {/* Conversation Display */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4 max-h-48 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">گفتگو:</h3>
              <div className="space-y-2">
                {conversation.map((item, index) => (
                  <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      item.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300'
                    }`}>
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Control Button */}
          <button
            onClick={() => setIsListening(!isListening)}
            className={`fixed bottom-24 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white shadow-2xl hover:scale-110`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
