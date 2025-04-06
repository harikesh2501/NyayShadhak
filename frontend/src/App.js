import React, { useState, useEffect } from 'react';
import './App.css';
import LanguageSelector from './components/LanguageSelector';
import ChatInterface from './components/ChatInterface';
import VoiceInput from './components/VoiceInput';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ur', name: 'اردو (Urdu)' }
  ];
  
  // Moved translations outside of the component to avoid re-creation on each render
  const translations = {
    en: {
      welcome: "Welcome to NyaySadhak - Your Legal Information Assistant",
      askQuestion: "Ask your legal question....",
      send: "Send",
      startVoice: "Start Voice",
      stopVoice: "Stop Voice",
      loading: "Thinking...",
      initialMessage: "Hello! I'm NyaySadhak, your legal assistant. What legal information do you need today?"
    },
    hi: {
      welcome: "न्यायसाधक में आपका स्वागत है - आपका कानूनी जानकारी सहायक",
      askQuestion: "अपना कानूनी प्रश्न पूछें...",
      send: "भेजें",
      startVoice: "आवाज़ शुरू करें",
      stopVoice: "आवाज़ बंद करें",
      loading: "विचार कर रहा हूँ...",
      initialMessage: "नमस्ते! मैं न्यायसाधक हूँ, आपका कानूनी सहायक। आज आपको किस कानूनी जानकारी की आवश्यकता है?"
    },
    bn: {
      welcome: "ন্যায়সাধক এ আপনাকে স্বাগতম - আপনার আইনি তথ্য সহকারী",
      askQuestion: "আপনার আইনি প্রশ্ন জিজ্ঞাসা করুন...",
      send: "পাঠান",
      startVoice: "ভয়েস শুরু করুন",
      stopVoice: "ভয়েস বন্ধ করুন",
      loading: "চিন্তা করছি...",
      initialMessage: "হ্যালো! আমি ন্যায়সাধক, আপনার আইনি সহকারী। আজ আপনার কি আইনি তথ্য দরকার?"
    },
    te: {
      welcome: "న్యాయసాధక్‌కి స్వాగతం - మీ చట్టపరమైన సమాచార సహాయకుడు",
      askQuestion: "మీ చట్టపరమైన ప్రశ్నను అడగండి...",
      send: "పంపండి",
      startVoice: "వాయిస్ ప్రారంభించండి",
      stopVoice: "వాయిస్ ఆపండి",
      loading: "ఆలోచిస్తున్నాను...",
      initialMessage: "హలో! నేను న్యాయసాధక్, మీ చట్టపరమైన సహాయకుడిని. ఈరోజు మీకు ఏ చట్టపరమైన సమాచారం కావాలి?"
    },
    ta: {
      welcome: "நியாய்சாதக்கிற்கு வரவேற்கிறோம் - உங்கள் சட்ட தகவல் உதவியாளர்",
      askQuestion: "உங்கள் சட்ட கேள்வியைக் கேளுங்கள்...",
      send: "அனுப்பு",
      startVoice: "குரல் தொடங்கு",
      stopVoice: "குரல் நிறுத்து",
      loading: "யோசிக்கிறேன்...",
      initialMessage: "வணக்கம்! நான் நியாய்சாதக், உங்கள் சட்ட உதவியாளர். இன்று உங்களுக்கு என்ன சட்டத் தகவல் தேவை?"
    },
    mr: {
      welcome: "न्यायसाधक मध्ये आपले स्वागत आहे - आपला कायदेशीर माहिती सहाय्यक",
      askQuestion: "आपला कायदेशीर प्रश्न विचारा...",
      send: "पाठवा",
      startVoice: "आवाज सुरू करा",
      stopVoice: "आवाज बंद करा",
      loading: "विचार करत आहे...",
      initialMessage: "नमस्कार! मी न्यायसाधक आहे, तुमचा कायदेशीर सहाय्यक. आज तुम्हाला कोणती कायदेशीर माहिती हवी आहे?"
    },
    gu: {
      welcome: "ન્યાયસાધક માં આપનું સ્વાગત છે - તમારો કાનૂની માહિતી સહાયક",
      askQuestion: "તમારો કાનૂની પ્રશ્ન પૂછો...",
      send: "મોકલો",
      startVoice: "અવાજ શરૂ કરો",
      stopVoice: "અવાજ બંધ કરો",
      loading: "વિચારી રહ્યો છું...",
      initialMessage: "નમસ્તે! હું ન્યાયસાધક છું, તમારો કાનૂની સહાયક. આજે તમને કઈ કાનૂની માહિતીની જરૂર છે?"
    },
    kn: {
      welcome: "ನ್ಯಾಯಸಾಧಕ್‌ಗೆ ಸುಸ್ವಾಗತ - ನಿಮ್ಮ ಕಾನೂನು ಮಾಹಿತಿ ಸಹಾಯಕ",
      askQuestion: "ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...",
      send: "ಕಳುಹಿಸು",
      startVoice: "ಧ್ವನಿ ಪ್ರಾರಂಭಿಸಿ",
      stopVoice: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
      loading: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
      initialMessage: "ನಮಸ್ಕಾರ! ನಾನು ನ್ಯಾಯಸಾಧಕ್, ನಿಮ್ಮ ಕಾನೂನು ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಯಾವ ಕಾನೂನು ಮಾಹಿತಿ ಬೇಕು?"
    },
    ml: {
      welcome: "ന്യായസാധകിലേക്ക് സ്വാഗതം - നിങ്ങളുടെ നിയമ വിവര സഹായി",
      askQuestion: "നിങ്ങളുടെ നിയമപരമായ ചോദ്യം ചോദിക്കുക...",
      send: "അയയ്ക്കുക",
      startVoice: "വോയ്സ് ആരംഭിക്കുക",
      stopVoice: "വോയ്സ് നിർത്തുക",
      loading: "ചിന്തിക്കുന്നു...",
      initialMessage: "ഹലോ! ഞാൻ ന്യായസാധക് ആണ്, നിങ്ങളുടെ നിയമ സഹായി. ഇന്ന് നിങ്ങൾക്ക് എന്ത് നിയമ വിവരമാണ് ആവശ്യം?"
    },
    pa: {
      welcome: "ਨਿਆਂਸਾਧਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ - ਤੁਹਾਡਾ ਕਾਨੂੰਨੀ ਜਾਣਕਾਰੀ ਸਹਾਇਕ",
      askQuestion: "ਆਪਣਾ ਕਾਨੂੰਨੀ ਸਵਾਲ ਪੁੱਛੋ...",
      send: "ਭੇਜੋ",
      startVoice: "ਵੋਇਸ ਸ਼ੁਰੂ ਕਰੋ",
      stopVoice: "ਵੋਇਸ ਬੰਦ ਕਰੋ",
      loading: "ਸੋਚ ਰਿਹਾ ਹਾਂ...",
      initialMessage: "ਹੈਲੋ! ਮੈਂ ਨਿਆਂਸਾਧਕ ਹਾਂ, ਤੁਹਾਡਾ ਕਾਨੂੰਨੀ ਸਹਾਇਕ। ਅੱਜ ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਕਾਨੂੰਨੀ ਜਾਣਕਾਰੀ ਦੀ ਲੋੜ ਹੈ?"
    },
    ur: {
      welcome: "نیائے ساڈھک میں خوش آمدید - آپکا قانونی معلومات کا مددگار",
      askQuestion: "اپنا قانونی سوال پوچھیں...",
      send: "بھیجیں",
      startVoice: "آواز شروع کریں",
      stopVoice: "آواز بند کریں",
      loading: "سوچ رہا ہوں...",
      initialMessage: "ہیلو! میں نیائے ساڈھک ہوں، آپکا قانونی مددگار۔ آج آپکو کونسی قانونی معلومات درکار ہے؟"
    }
  };

  // Fix: removed translations from dependency array to prevent infinite loop
  useEffect(() => {
    // Add initial bot message
    setMessages([
      {
        text: translations[selectedLanguage]?.initialMessage || translations.en.initialMessage,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  }, [selectedLanguage]); // Only depend on selectedLanguage

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    
    try {
      // Using relative URL - will be proxied to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage = {
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message
      const errorMessage = {
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleVoiceInput = (transcript) => {
    sendMessage(transcript);
  };

  return (
    <div className="app">
      <Header title={translations[selectedLanguage]?.welcome || translations.en.welcome} />
      
      <div className="app-container">
        <div className="sidebar">
          <LanguageSelector 
            languages={supportedLanguages} 
            selectedLanguage={selectedLanguage} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
        
        <main className="main-content">
          <ChatInterface 
            messages={messages} 
            loading={loading}
            loadingText={translations[selectedLanguage]?.loading || translations.en.loading}
          />
          
          <div className="input-area">
            <VoiceInput 
              onTranscript={handleVoiceInput}
              isListening={isListening}
              setIsListening={setIsListening}
              language={selectedLanguage}
              startButtonText={translations[selectedLanguage]?.startVoice || translations.en.startVoice}
              stopButtonText={translations[selectedLanguage]?.stopVoice || translations.en.stopVoice}
            />
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.messageInput;
              sendMessage(input.value);
              input.value = '';
            }}>
              <input
                type="text"
                name="messageInput"
                placeholder={translations[selectedLanguage]?.askQuestion || translations.en.askQuestion}
                disabled={isListening}
              />
              <button type="submit">
                {translations[selectedLanguage]?.send || translations.en.send}
              </button>
            </form>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;