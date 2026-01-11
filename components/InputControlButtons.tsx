
import React, { useState, useEffect, useRef } from 'react';

interface InputControlButtonsProps {
  value: string;
  onUpdate: (newValue: string) => void;
  onClear: () => void;
  className?: string;
  dark?: boolean;
}

const InputControlButtons: React.FC<InputControlButtonsProps> = ({ 
  value, 
  onUpdate, 
  onClear, 
  className = "",
  dark = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("お使いのブラウザは音声入力に対応していません。(Chrome, Safari, Edge推奨)");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Append content with a space if there is existing text
      const newValue = value ? `${value} ${transcript}` : transcript;
      onUpdate(newValue);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const iconClass = dark ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-indigo-600";
  const activeMicClass = "text-red-500 animate-pulse";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {value && (
        <button
          onClick={onClear}
          className={`p-3 md:p-1.5 rounded-full transition-all hover:bg-black/5 ${iconClass}`}
          title="消去"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
        </button>
      )}
      <button
        onClick={handleVoiceInput}
        className={`p-3 md:p-1.5 rounded-full transition-all hover:bg-black/5 ${isListening ? activeMicClass : iconClass}`}
        title="音声入力"
        type="button"
      >
        {isListening ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="animate-pulse"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        )}
      </button>
    </div>
  );
};

export default InputControlButtons;
