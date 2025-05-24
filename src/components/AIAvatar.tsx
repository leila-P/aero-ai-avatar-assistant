
import { useState, useEffect, useRef } from 'react';
import { Play } from "lucide-react";

interface AIAvatarProps {
  isListening: boolean;
  conversation: Array<{type: 'user' | 'ai', message: string}>;
  onConversationUpdate: (conversation: Array<{type: 'user' | 'ai', message: string}>) => void;
}

const AIAvatar = ({ isListening, conversation, onConversationUpdate }: AIAvatarProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoState, setCurrentVideoState] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate AI responses
  const generateAIResponse = (userMessage: string) => {
    const responses = [
      "سلام! من اینجا هستم تا به شما در رزرو بلیط کمک کنم. از کدام شهر می‌خواهید پرواز کنید؟",
      "عالی! حالا مقصد شما کجاست؟",
      "چه تاریخی را برای پرواز در نظر دارید؟",
      "چند مسافر خواهید داشت؟",
      "آیا ترجیح خاصی برای کلاس پرواز دارید؟",
      "در حال جستجوی بهترین گزینه‌ها برای شما هستم..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  useEffect(() => {
    if (isListening) {
      setCurrentVideoState('listening');
      // Simulate speech recognition
      setTimeout(() => {
        const userMessage = "می‌خواهم از تهران به استانبول پرواز کنم";
        const newConversation = [...conversation, { type: 'user' as const, message: userMessage }];
        
        setTimeout(() => {
          const aiResponse = generateAIResponse(userMessage);
          newConversation.push({ type: 'ai' as const, message: aiResponse });
          onConversationUpdate(newConversation);
          setCurrentVideoState('speaking');
          
          // Simulate speaking time
          setTimeout(() => {
            setCurrentVideoState('idle');
          }, 3000);
        }, 1000);
        
        onConversationUpdate(newConversation);
      }, 2000);
    } else {
      setCurrentVideoState('idle');
    }
  }, [isListening]);

  return (
    <div className="relative">
      {/* Avatar Container */}
      <div className="relative w-96 h-96 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-2xl">
        {/* Video Avatar */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23374151'/%3E%3Ccircle cx='200' cy='180' r='60' fill='%236B7280'/%3E%3Ccircle cx='180' cy='170' r='8' fill='%23E5E7EB'/%3E%3Ccircle cx='220' cy='170' r='8' fill='%23E5E7EB'/%3E%3Cpath d='M170 210 Q200 230 230 210' stroke='%23E5E7EB' stroke-width='3' fill='none'/%3E%3C/svg%3E"
        >
          <source src={`/avatar-${currentVideoState}.mp4`} type="video/mp4" />
        </video>

        {/* Status Indicator */}
        <div className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
          currentVideoState === 'listening' ? 'bg-red-500 animate-pulse' :
          currentVideoState === 'speaking' ? 'bg-green-500 animate-pulse' :
          'bg-blue-500'
        }`}></div>

        {/* Audio Visualization */}
        {(isListening || currentVideoState === 'speaking') && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-blue-400 rounded-full animate-pulse`}
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 100}ms`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar Name */}
      <div className="text-center mt-4">
        <h3 className="text-xl font-bold text-white">آریا</h3>
        <p className="text-gray-400">دستیار هوش مصنوعی پرواز</p>
      </div>

      {/* Status Text */}
      <div className="text-center mt-2">
        <p className={`text-sm ${
          currentVideoState === 'listening' ? 'text-red-400' :
          currentVideoState === 'speaking' ? 'text-green-400' :
          'text-blue-400'
        }`}>
          {currentVideoState === 'listening' ? 'در حال گوش دادن...' :
           currentVideoState === 'speaking' ? 'در حال صحبت...' :
           'آماده گفتگو'}
        </p>
      </div>

      {/* Floating Animation */}
      <div className="absolute -z-10 inset-0 animate-pulse">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"></div>
      </div>
    </div>
  );
};

export default AIAvatar;
