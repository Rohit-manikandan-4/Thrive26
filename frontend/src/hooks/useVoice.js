import { useCallback, useEffect, useRef, useState } from 'react';

const LANG_TO_BCP47 = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
};

export function useVoice(language) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const speechRecognitionSupported =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
      if (speechSynthesisSupported) window.speechSynthesis.cancel();
    };
  }, [speechSynthesisSupported]);

  const listen = useCallback(
    ({ onResult, onError }) => {
      if (!speechRecognitionSupported) {
        onError?.('unsupported');
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = LANG_TO_BCP47[language] || 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        setIsListening(false);
        onError?.(e.error);
      };
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) onResult?.(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [language, speechRecognitionSupported]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop?.();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!speechSynthesisSupported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_TO_BCP47[language] || 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [language, speechSynthesisSupported]
  );

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [speechSynthesisSupported]);

  return {
    speechRecognitionSupported: !!speechRecognitionSupported,
    speechSynthesisSupported: !!speechSynthesisSupported,
    isListening,
    isSpeaking,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  };
}
