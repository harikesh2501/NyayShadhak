import React, { useEffect, useState, useRef, useCallback } from 'react';

function VoiceInput({ 
  onTranscript, 
  isListening, 
  setIsListening, 
  language,
  startButtonText,
  stopButtonText
}) {
  const recognitionRef = useRef(null);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true);

  // Define stopListening with useCallback
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [setIsListening]);

  useEffect(() => {
    // Check if speech recognition is supported
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupportedBrowser(isSupported);
    
    if (isSupported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      // Set language
      const langMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN',
        'ur': 'ur-IN'
      };
      
      recognitionRef.current.lang = langMap[language] || 'en-US';
      
      let finalTranscript = '';
      
      recognitionRef.current.onresult = (event) => {
        // We're storing interim transcript but not using it now
        // Could be used for showing real-time transcription in future
        let interimTranscript = ''; // eslint-disable-line no-unused-vars
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // When we have a final transcript, send it
        if (finalTranscript !== '') {
          onTranscript(finalTranscript);
          finalTranscript = '';
          stopListening();
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopListening();
      };
    }
    
    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript, stopListening]); // Added stopListening to dependencies

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }, [setIsListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Don't render the button if speech recognition isn't supported
  if (!isSupportedBrowser) {
    return null;
  }

  return (
    <div className="voice-input">
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
      >
        <i className={`fa ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        {isListening ? stopButtonText : startButtonText}
      </button>
    </div>
  );
}

export default VoiceInput;