
import React, { useState, useRef, useEffect } from 'react';
import { Message, CityInfo } from './types';
import { getCityInformation } from './services/geminiService';
import CityCard from './components/CityCard';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello traveler! I'm Wanders, your AI Tour Guide. Which city are you planning to visit? Just type a name like 'Paris', 'Tokyo', or 'New York'!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const cityData = await getCityInformation(query);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `I've found some great spots in ${cityData.cityName}!`,
        cityData,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm sorry, I had trouble finding information for that location. Could you try another city?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="fas fa-compass text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Wanderlust AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Virtual Tour Guide</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              <i className="fas fa-circle text-[8px] mr-1"></i> Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Chat Feed */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6 mb-4"
          style={{ height: 'calc(100vh - 220px)' }}
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm ${
                  msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className={`rounded-2xl px-4 py-3 text-sm md:text-base ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.cityData && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <CityCard data={msg.cityData} />
                    </div>
                  )}

                  <div className={`text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs shadow-sm">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-2 sm:p-3 relative">
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-10 h-10 rounded-xl hover:bg-slate-100 items-center justify-center text-slate-400 transition-colors">
              <i className="fas fa-paperclip"></i>
            </button>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about a city (e.g., 'What's in London?')..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 py-2 px-2 md:text-base text-sm outline-none"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isTyping 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <i className={`fas ${isTyping ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Powered by Gemini 3 Flash • Built for Travelers
        </p>
      </main>

      {/* Decorative background elements (optional) */}
      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
    </div>
  );
};

export default App;
