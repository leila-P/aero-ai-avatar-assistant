
import { useEffect, useRef, useState } from 'react';

interface UserDetectionProps {
  onUserDetected: () => void;
}

const UserDetection = ({ onUserDetected }: UserDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionTimer, setDetectionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsDetecting(true);
          
          // Simulate face detection
          simulateUserDetection();
        }
      } catch (error) {
        console.log('Camera access denied or not available');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (detectionTimer) {
        clearTimeout(detectionTimer);
      }
    };
  }, []);

  const simulateUserDetection = () => {
    // Simulate user detection after 3 seconds
    const timer = setTimeout(() => {
      onUserDetected();
    }, 3000);
    
    setDetectionTimer(timer);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Hidden camera preview */}
      <div className="relative w-32 h-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-600 opacity-80">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        
        {isDetecting && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
        
        <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
          تشخیص کاربر
        </div>
      </div>
    </div>
  );
};

export default UserDetection;
