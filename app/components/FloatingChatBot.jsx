'use client';

import { useState, useRef, useEffect } from 'react';

const FAQ_CATEGORIES = [
  {
    id: 'shipping',
    name: 'משלוחים',
    questions: [
      { question: 'כמה זמן לוקח משלוח?', answer: 'משלוחים מגיעים תוך 3-5 ימי עסקים. משלוח אקספרס תוך 1-2 ימי עסקים.' },
      { question: 'האם יש משלוח חינם?', answer: 'כן! משלוח חינם בכל הזמנה מעל ₪200.' },
      { question: 'לאן אתם שולחים?', answer: 'אנחנו שולחים לכל רחבי הארץ, כולל יהודה ושומרון.' },
      { question: 'מעקב משלוח', answer: 'לאחר המשלוח תקבל SMS עם קישור למעקב. ניתן גם לעקוב באזור "ההזמנות שלי".' },
    ]
  },
  {
    id: 'payment',
    name: 'תשלומים',
    questions: [
      { question: 'אמצעי תשלום', answer: 'אנחנו מקבלים כרטיסי אשראי (ויזה, מאסטרקארד, אמקס), ביט, PayPal ותשלום במזומן בעת האיסוף.' },
      { question: 'תשלומים', answer: 'כן! עד 12 תשלומים ללא ריבית בכרטיסי אשראי נבחרים.' },
      { question: 'אבטחת תשלום', answer: 'בהחלט! אנחנו משתמשים בהצפנת SSL ועומדים בתקן PCI DSS לאבטחת תשלומים.' },
    ]
  },
  {
    id: 'returns',
    name: 'החזרות וביטולים',
    questions: [
      { question: 'מדיניות החזרות', answer: 'ניתן להחזיר מוצרים תוך 14 יום מיום הקנייה, כל עוד המוצר באריזתו המקורית ובמצב תקין.' },
      { question: 'ביטול הזמנה', answer: 'ניתן לבטל הזמנה לפני המשלוח באזור "ההזמנות שלי" או ליצור קשר עם שירות הלקוחות.' },
      { question: 'החזר כספי', answer: 'ההחזר מתבצע תוך 7-14 ימי עסקים לאמצעי התשלום המקורי.' },
    ]
  },
  {
    id: 'account',
    name: 'חשבון וסוכנים',
    questions: [
      { question: 'הרשמה לאתר', answer: 'לחצו על "החשבון שלי" בתפריט העליון ובחרו "הרשמה". תוכלו להירשם עם מייל או דרך גוגל.' },
      { question: 'להפוך לסוכן', answer: 'ניתן להירשם כסוכן דרך האזור האישי. סוכנים מרוויחים עמלות על כל מכירה שהביאו!' },
      { question: 'יתרונות סוכן', answer: 'סוכנים מקבלים עמלה על כל מכירה, גישה למוצרים בלעדיים, ותמיכה אישית.' },
      { question: 'שכחתי סיסמה', answer: 'לחצו על "שכחתי סיסמה" בדף ההתחברות ונשלח לכם קישור לאיפוס למייל.' },
    ]
  },
  {
    id: 'general',
    name: 'שאלות כלליות',
    questions: [
      { question: 'שעות פעילות', answer: 'אנחנו זמינים בימים א\'-ה\' 9:00-18:00, ו\' 9:00-13:00. שבת - סגור.' },
      { question: 'יצירת קשר', answer: 'טלפון: 03-1234567 | מייל: support@vipo.co.il | וואטסאפ: 050-1234567' },
      { question: 'חנות פיזית', answer: 'כרגע אנחנו פועלים באונליין בלבד, עם נקודות איסוף ברחבי הארץ.' },
    ]
  },
  {
    id: 'support',
    name: 'שיחה עם נציג',
    isContact: true,
    questions: []
  }
];

const ALL_QUESTIONS = FAQ_CATEGORIES.flatMap(cat => cat.questions);

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showContactInput, setShowContactInput] = useState(false);
  const messagesEndRef = useRef(null);

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
    if (isOpen && messages.length === 0) {
      showWelcome();
    }
  }, [isOpen]);

  const showWelcome = () => {
    setMessages([
      { type: 'bot', text: 'שלום! אני הבוט של VIPO.' },
      { type: 'bot', text: 'איך אפשר לעזור לך היום?', showCategories: true }
    ]);
    setShowContactInput(false);
  };

  const handleCategoryClick = (category) => {
    if (category.isContact) {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: category.name },
        { type: 'bot', text: 'נשמח לעזור!' },
        { type: 'bot', text: 'כתוב את ההודעה שלך ונציג יחזור אליך בהקדם:', showContactForm: true }
      ]);
      setShowContactInput(true);
      scrollToBottom();
      return;
    }

    setMessages(prev => [
      ...prev,
      { type: 'user', text: category.name },
      { type: 'bot', text: `מה תרצה לדעת על ${category.name}?`, showQuestions: category.id }
    ]);
    scrollToBottom();
  };

  const handleQuestionClick = (question, answer) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: question },
      { type: 'bot', text: answer },
      { type: 'bot', text: 'האם יש משהו נוסף שאוכל לעזור?', showActions: true }
    ]);
    scrollToBottom();
  };

  const handleAction = (action) => {
    if (action === 'categories') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: 'בחירת נושא אחר' },
        { type: 'bot', text: 'בחר נושא:', showCategories: true }
      ]);
    } else if (action === 'contact') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: 'שיחה עם נציג' },
        { type: 'bot', text: 'כתוב את ההודעה שלך:', showContactForm: true }
      ]);
      setShowContactInput(true);
    } else if (action === 'done') {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: 'זה הכל, תודה!' },
        { type: 'bot', text: 'תודה רבה! שמחנו לעזור. אם תצטרך עוד משהו, אני כאן.' }
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
          { type: 'bot', text: 'האם יש משהו נוסף?', showActions: true }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { type: 'bot', text: 'לא מצאתי תשובה מתאימה.' },
          { type: 'bot', text: 'מה תרצה לעשות?', showActions: true }
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
          { type: 'bot', text: 'ההודעה נשלחה בהצלחה!' },
          { type: 'bot', text: 'צוות התמיכה יחזור אליך בהקדם. יש משהו נוסף?', showActions: true }
        ]);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { type: 'bot', text: 'שגיאה בשליחה. נסה שוב או התקשר 03-1234567' },
        { type: 'bot', text: 'מה תרצה לעשות?', showActions: true }
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

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 left-4 w-[340px] sm:w-[420px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">שירות לקוחות</h3>
                <p className="text-white/70 text-xs">מענה מיידי לשאלות נפוצות</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={resetChat}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                title="התחל מחדש"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                title="סגור"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Message Bubble */}
                <div className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'} mb-2`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.type === 'user' 
                        ? 'bg-gray-200 text-gray-800 rounded-tr-none' 
                        : 'text-white rounded-tl-none'
                    }`}
                    style={msg.type === 'bot' ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                  >
                    {msg.text}
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
                      חזרה לנושאים
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
                      נושא אחר
                    </button>
                    <button
                      onClick={() => handleAction('contact')}
                      className="px-3 py-2 rounded-xl bg-white border-2 border-cyan-500 hover:bg-cyan-50 transition-all text-cyan-700 text-sm font-medium"
                    >
                      שיחה עם נציג
                    </button>
                    <button
                      onClick={() => handleAction('done')}
                      className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-all text-gray-600 text-sm"
                    >
                      זה הכל, תודה
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
                        placeholder="כתוב את ההודעה שלך..."
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none h-20 focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSendToAdmin}
                          disabled={sendingMessage || !contactMessage.trim()}
                          className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                        >
                          {sendingMessage ? 'שולח...' : 'שלח'}
                        </button>
                        <button
                          onClick={() => handleAction('categories')}
                          className="px-3 py-2 rounded-lg text-gray-600 text-sm border border-gray-200 hover:bg-gray-50"
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={showContactInput ? contactMessage : inputValue}
                onChange={(e) => showContactInput ? setContactMessage(e.target.value) : setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={showContactInput ? "כתוב הודעה לנציג..." : "כתוב שאלה..."}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-cyan-500 text-sm"
              />
              <button
                onClick={showContactInput ? handleSendToAdmin : handleSendMessage}
                disabled={sendingMessage}
                className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 z-50"
        style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
          boxShadow: '0 4px 20px rgba(8, 145, 178, 0.4)'
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
