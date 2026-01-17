'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

// Pages where chatbot should be hidden
const HIDDEN_PATHS = ['/messages'];

// Default config for fallback
const DEFAULT_CONFIG = {
  texts: {
    title: 'שירות לקוחות',
    subtitle: 'מענה מיידי לשאלות נפוצות',
    welcome1: 'שלום! אני הבוט של VIPO.',
    welcome2: 'איך אפשר לעזור לך היום?',
    happyHelp: 'נשמח לעזור!',
    writeMessage: 'כתוב את ההודעה שלך ונציג יחזור אליך בהקדם:',
    whatKnow: 'מה תרצה לדעת?',
    anythingElse: 'האם יש משהו נוסף שאוכל לעזור?',
    noAnswer: 'לא מצאתי תשובה מתאימה.',
    whatDo: 'מה תרצה לעשות?',
    goodbye: 'תודה רבה! שמחנו לעזור. אם תצטרך עוד משהו, אני כאן.',
    sentSuccess: 'ההודעה נשלחה בהצלחה!',
    teamReply: 'צוות התמיכה יחזור אליך בהקדם. יש משהו נוסף?',
    sendError: 'שגיאה בשליחה. נסה שוב או התקשר 03-1234567',
    moreHelp: 'האם יש משהו נוסף?',
    chooseTopic: 'בחר נושא:'
  },
  buttons: {
    otherTopic: 'נושא אחר',
    talkAgent: 'שיחה עם נציג',
    thanks: 'זה הכל, תודה',
    backTopics: 'חזרה לנושאים',
    send: 'שלח',
    sending: 'שולח...',
    cancel: 'ביטול'
  },
  placeholders: {
    message: 'כתוב את ההודעה שלך...',
    agent: 'כתוב הודעה לנציג...',
    question: 'כתוב שאלה...'
  },
  categories: [],
  settings: { isActive: true, position: 'left' }
};

export default function FloatingChatBot() {
  const pathname = usePathname();
  const [botConfig, setBotConfig] = useState(DEFAULT_CONFIG);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showContactInput, setShowContactInput] = useState(false);
  const messagesEndRef = useRef(null);

  // Load bot config from API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/bot-config?ownerType=admin');
        const data = await res.json();
        if (data.success && data.config) {
          setBotConfig(data.config);
        }
      } catch (error) {
        console.error('Error loading bot config:', error);
      } finally {
        setConfigLoaded(true);
      }
    };
    loadConfig();
  }, []);

  // Helper to get text from config
  const getText = (key, fallback) => {
    const keys = key.split('.');
    let value = botConfig;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback;
  };

  // Get categories from config
  const FAQ_CATEGORIES = useMemo(() => {
    if (botConfig.categories && botConfig.categories.length > 0) {
      return botConfig.categories.filter(c => c.isActive !== false);
    }
    return DEFAULT_CONFIG.categories;
  }, [botConfig.categories]);

  const ALL_QUESTIONS = useMemo(() => {
    return FAQ_CATEGORIES.flatMap(cat => cat.questions || []);
  }, [FAQ_CATEGORIES]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && configLoaded) {
      showWelcome();
    }
  }, [isOpen, configLoaded]);

  const showWelcome = () => {
    setMessages([
      { type: 'bot', text: botConfig.texts?.welcome1 || 'שלום! אני הבוט של VIPO.' },
      { type: 'bot', text: botConfig.texts?.welcome2 || 'איך אפשר לעזור לך היום?', showCategories: true }
    ]);
    setShowContactInput(false);
  };

  const handleCategoryClick = (category) => {
    if (category.isContact) {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: category.name },
        { type: 'bot', text: botConfig.texts?.happyHelp || 'נשמח לעזור!' },
        { type: 'bot', text: botConfig.texts?.writeMessage || 'כתוב את ההודעה שלך ונציג יחזור אליך בהקדם:', showContactForm: true }
      ]);
      setShowContactInput(true);
      scrollToBottom();
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: 'user', text: category.name },
      { type: 'bot', text: botConfig.texts?.whatKnow || 'מה תרצה לדעת?', showQuestions: category.id }
    ]);
    scrollToBottom();
  };

  const handleQuestionClick = (question, answer) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: question },
      { type: 'bot', text: answer },
      { type: 'bot', text: botConfig.texts?.anythingElse || 'האם יש משהו נוסף שאוכל לעזור?', showActions: true }
    ]);
    scrollToBottom();
  };

  const handleAction = (action) => {
    if (action === 'categories') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: botConfig.buttons?.otherTopic || 'נושא אחר' },
        { type: 'bot', text: botConfig.texts?.chooseTopic || 'בחר נושא:', showCategories: true }
      ]);
    } else if (action === 'contact') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: botConfig.buttons?.talkAgent || 'שיחה עם נציג' },
        { type: 'bot', text: botConfig.texts?.writeMessage || 'כתוב את ההודעה שלך:', showContactForm: true }
      ]);
      setShowContactInput(true);
    } else if (action === 'done') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: botConfig.buttons?.thanks || 'זה הכל, תודה!' },
        { type: 'bot', text: botConfig.texts?.goodbye || 'תודה רבה! שמחנו לעזור. אם תצטרך עוד משהו, אני כאן.' }
      ]);
    }
    scrollToBottom();
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

    const matchedFaq = ALL_QUESTIONS.find(faq => 
      faq.question.toLowerCase().includes(userMessage.toLowerCase()) || 
      userMessage.toLowerCase().includes(faq.question.toLowerCase()) ||
      faq.answer.toLowerCase().includes(userMessage.toLowerCase())
    );

    setTimeout(() => {
      if (matchedFaq) {
        setMessages(prev => [
          ...prev, 
          { type: 'bot', text: matchedFaq.answer },
          { type: 'bot', text: botConfig.texts?.moreHelp || 'האם יש משהו נוסף?', showActions: true }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { type: 'bot', text: botConfig.texts?.noAnswer || 'לא מצאתי תשובה מתאימה.' },
          { type: 'bot', text: botConfig.texts?.whatDo || 'מה תרצה לעשות?', showActions: true }
        ]);
      }
      scrollToBottom();
    }, 500);
  };

  const handleSendToAdmin = async () => {
    if (!contactMessage.trim()) return;
    
    const msg = contactMessage.trim();
    setContactMessage('');
    setSendingMessage(true);
    setShowContactInput(false);
    
    setMessages(prev => [...prev, { type: 'user', text: msg }]);
    
    try {
      const res = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg,
          source: 'chatbot',
          conversation: messages.map(m => `${m.type}: ${m.text}`).join('\n')
        })
      });
      
      if (res.ok) {
        setMessages(prev => [
          ...prev, 
          { type: 'bot', text: botConfig.texts?.sentSuccess || 'ההודעה נשלחה בהצלחה!' },
          { type: 'bot', text: botConfig.texts?.teamReply || 'צוות התמיכה יחזור אליך בהקדם. יש משהו נוסף?', showActions: true }
        ]);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { type: 'bot', text: botConfig.texts?.sendError || 'שגיאה בשליחה. נסה שוב או התקשר 03-1234567' },
        { type: 'bot', text: botConfig.texts?.whatDo || 'מה תרצה לעשות?', showActions: true }
      ]);
    }
    setSendingMessage(false);
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showContactInput) {
        handleSendToAdmin();
      } else {
        handleSendMessage();
      }
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowContactInput(false);
    setContactMessage('');
    setTimeout(showWelcome, 100);
  };

  // Hide on specific pages (after all hooks)
  if (HIDDEN_PATHS.some(path => pathname?.startsWith(path))) {
    return null;
  }

  return (
    <>
      {/* Chat Window - Full Screen on Mobile, WhatsApp Style */}
      {isOpen && (
        <div 
          className="fixed z-50 overflow-hidden flex flex-col bg-gray-100 inset-0 sm:inset-auto sm:bottom-24 sm:left-4 sm:w-[420px] sm:h-[600px] sm:max-h-[calc(100vh-120px)] sm:rounded-2xl sm:shadow-2xl"
          style={{
            '--mobile-height': '100dvh',
          }}
        >
          {/* Header - WhatsApp Style */}
          <header
            className="flex items-center gap-3 px-4 py-3 shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-white font-semibold">{botConfig.texts?.title || 'שירות לקוחות'}</h1>
              <p className="text-white/70 text-xs">{botConfig.texts?.subtitle || 'מענה מיידי לשאלות נפוצות'}</p>
            </div>
            <button 
              onClick={resetChat}
              className="text-white/80 hover:text-white p-2"
              title="התחל מחדש"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </header>

          {/* Messages Area - WhatsApp Style */}
          <div 
            className="flex-1 overflow-y-auto flex flex-col"
            style={{ background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.08) 0%, rgba(8, 145, 178, 0.12) 100%)' }}
          >
            <div className="flex-1" />
            <div className="py-4 px-3">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Message Bubble - WhatsApp Style */}
                <div className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'} mb-2`}>
                  <div 
                    className={`max-w-[75%] rounded-2xl px-3 py-1.5 shadow-sm text-sm ${
                      msg.type === 'user' 
                        ? 'bg-white text-gray-900 rounded-br-sm' 
                        : 'text-white rounded-bl-sm'
                    }`}
                    style={msg.type === 'bot' ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                  >
                    <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>

                {/* Categories Buttons (inline in chat) */}
                {msg.showCategories && (
                  <div className="flex flex-wrap gap-2 justify-end mb-2">
                    {FAQ_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className="px-3 py-2 rounded-xl bg-white border-2 border-cyan-500 hover:bg-cyan-50 transition-all text-cyan-700 text-sm font-medium"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Questions Buttons (inline in chat) */}
                {msg.showQuestions && (
                  <div className="flex flex-col gap-2 items-end mb-2">
                    {FAQ_CATEGORIES.find(c => c.id === msg.showQuestions)?.questions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleQuestionClick(q.question, q.answer)}
                        className="px-3 py-2 rounded-xl bg-white border border-gray-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all text-gray-700 text-sm text-right max-w-[85%]"
                      >
                        {q.question}
                      </button>
                    ))}
                    <button
                      onClick={() => handleAction('categories')}
                      className="px-3 py-1.5 text-xs text-cyan-600 hover:text-cyan-800 underline"
                    >
                      {botConfig.buttons?.backTopics || 'חזרה לנושאים'}
                    </button>
                  </div>
                )}

                {/* Action Buttons (inline in chat) */}
                {msg.showActions && (
                  <div className="flex flex-wrap gap-2 justify-end mb-2">
                    <button
                      onClick={() => handleAction('categories')}
                      className="px-3 py-2 rounded-xl bg-white border-2 border-cyan-500 hover:bg-cyan-50 transition-all text-cyan-700 text-sm font-medium"
                    >
                      {botConfig.buttons?.otherTopic || 'נושא אחר'}
                    </button>
                    <button
                      onClick={() => handleAction('contact')}
                      className="px-3 py-2 rounded-xl bg-white border-2 border-cyan-500 hover:bg-cyan-50 transition-all text-cyan-700 text-sm font-medium"
                    >
                      {botConfig.buttons?.talkAgent || 'שיחה עם נציג'}
                    </button>
                    <button
                      onClick={() => handleAction('done')}
                      className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-all text-gray-600 text-sm"
                    >
                      {botConfig.buttons?.thanks || 'זה הכל, תודה'}
                    </button>
                  </div>
                )}

                {/* Contact Form (inline in chat) */}
                {msg.showContactForm && (
                  <div className="flex justify-end mb-2">
                    <div className="w-[85%] p-3 bg-white rounded-xl border-2 border-cyan-200">
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendToAdmin()}
                        placeholder={botConfig.placeholders?.message || 'כתוב את ההודעה שלך...'}
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none h-20 focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSendToAdmin}
                          disabled={sendingMessage || !contactMessage.trim()}
                          className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                        >
                          {sendingMessage ? (botConfig.buttons?.sending || 'שולח...') : (botConfig.buttons?.send || 'שלח')}
                        </button>
                        <button
                          onClick={() => handleAction('categories')}
                          className="px-3 py-2 rounded-lg text-gray-600 text-sm border border-gray-200 hover:bg-gray-50"
                        >
                          {botConfig.buttons?.cancel || 'ביטול'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - WhatsApp Style */}
          <form 
            onSubmit={(e) => { e.preventDefault(); showContactInput ? handleSendToAdmin() : handleSendMessage(); }} 
            className="bg-gray-100 px-2 py-1.5 flex items-center gap-2 flex-shrink-0"
          >
            <div className="flex-1">
              <input
                type="text"
                value={showContactInput ? contactMessage : inputValue}
                onChange={(e) => showContactInput ? setContactMessage(e.target.value) : setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    showContactInput ? handleSendToAdmin() : handleSendMessage();
                  }
                }}
                placeholder={showContactInput ? (botConfig.placeholders?.agent || 'הודעה') : (botConfig.placeholders?.question || 'הודעה')}
                className="w-full text-sm bg-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                style={{ height: '36px' }}
              />
            </div>
            <button
              type="submit"
              disabled={sendingMessage || (showContactInput ? !contactMessage.trim() : !inputValue.trim())}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
            >
              <svg className="w-4 h-4 scale-x-[-1]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button - Hidden on mobile when chat is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 z-50"
          style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.4)'
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* CSS for Mobile Full Screen */}
      <style jsx global>{`
        @media (max-width: 639px) {
          .fixed.z-50.inset-0 {
            height: 100dvh !important;
            max-height: -webkit-fill-available !important;
          }
        }
      `}</style>
    </>
  );
}
