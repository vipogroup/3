'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';

export default function CRMDashboard() {
  const { settings } = useTheme();
  
  // Dynamic colors from settings
  const primaryColor = settings?.primaryColor || '#1e3a8a';
  const secondaryColor = settings?.secondaryColor || '#0891b2';
  const mainGradient = settings?.buttonGradient || `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  // Main navigation tabs
  const mainTabs = [
    { id: 'inbox', label: 'Inbox', icon: 'inbox' },
    { id: 'leads', label: 'לידים', icon: 'users' },
    { id: 'tasks', label: 'משימות', icon: 'tasks' },
    { id: 'pipeline', label: 'Pipeline', icon: 'pipeline' },
  ];

  // State
  const [activeTab, setActiveTab] = useState('inbox');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Additional state for new tabs
  const [tasks, setTasks] = useState([]);
  const [leadsFilter, setLeadsFilter] = useState('');
  const [tasksFilter, setTasksFilter] = useState('');
  const [pipelineLeads, setPipelineLeads] = useState({
    lead: [], contact: [], meeting: [], proposal: [], negotiation: [], won: [], lost: []
  });

  // Queues for filtering
  const queues = [
    { id: 'all', name: 'כל ההודעות', icon: 'inbox', count: 0 },
    { id: 'new', name: 'חדשים', icon: 'new', count: 0 },
    { id: 'followup', name: 'דורש מעקב', icon: 'bell', count: 0 },
    { id: 'vip', name: 'VIP', icon: 'star', count: 0 },
  ];

  const QueueIcon = ({ type }) => {
    const icons = {
      inbox: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
      new: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
      bell: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
      star: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    };
    return icons[type] || null;
  };
  const [activeQueue, setActiveQueue] = useState('all');

  useEffect(() => {
    checkConnection();
    fetchConversations();
    fetchLeads();
    fetchTasks();
    
    const interval = setInterval(() => {
      if (activeTab === 'inbox') {
        fetchConversations();
        if (selectedConversation) {
          fetchMessages(selectedConversation.phone);
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedConversation, activeTab]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/crm/tasks?limit=100');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const groupLeadsByPipeline = (leadsData) => {
    const grouped = { lead: [], contact: [], meeting: [], proposal: [], negotiation: [], won: [], lost: [] };
    leadsData.forEach(lead => {
      const stage = lead.pipelineStage || 'lead';
      if (grouped[stage]) {
        grouped[stage].push(lead);
      } else {
        grouped.lead.push(lead);
      }
    });
    setPipelineLeads(grouped);
  };

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/crm/whatsapp/status');
      const data = await res.json();
      setConnected(data.ready);
    } catch (error) {
      setConnected(false);
    }
  };

  const fetchQRCode = async () => {
    setQrLoading(true);
    try {
      const res = await fetch('/api/crm/whatsapp/qr');
      const data = await res.json();
      if (data.qrCode) {
        setQrCode(data.qrCode);
      } else if (data.ready) {
        setConnected(true);
        setShowQRModal(false);
      }
    } catch (error) {
      console.error('Error fetching QR:', error);
    } finally {
      setQrLoading(false);
    }
  };

  const openQRModal = () => {
    setShowQRModal(true);
    setQrCode(null); // Reset QR code
    fetchQRCode();
    const interval = setInterval(() => {
      fetchQRCode();
      checkConnection().then(() => {
        if (connected) {
          clearInterval(interval);
          setShowQRModal(false);
        }
      });
    }, 3000);
    // Store interval to clear it when modal closes
    return () => clearInterval(interval);
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/crm/whatsapp/messages');
      const data = await res.json();
      
      if (data.messages) {
        const grouped = {};
        data.messages.forEach(msg => {
          const phone = msg.type === 'incoming' ? msg.from : msg.to;
          if (!phone) return;
          
          if (!grouped[phone]) {
            grouped[phone] = {
              phone,
              messages: [],
              lastMessage: null,
              unread: 0,
            };
          }
          grouped[phone].messages.push(msg);
          
          if (!grouped[phone].lastMessage || 
              new Date(msg.timestamp) > new Date(grouped[phone].lastMessage.timestamp)) {
            grouped[phone].lastMessage = msg;
          }
          
          if (msg.type === 'incoming' && msg.status !== 'read') {
            grouped[phone].unread++;
          }
        });
        
        const convList = Object.values(grouped).sort((a, b) => 
          new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0)
        );
        
        setConversations(convList);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/crm/leads?limit=100');
      const data = await res.json();
      const leadsData = data.leads || [];
      setLeads(leadsData);
      groupLeadsByPipeline(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchMessages = async (phone) => {
    try {
      const res = await fetch('/api/crm/whatsapp/messages');
      const data = await res.json();
      
      if (data.messages) {
        const phoneMessages = data.messages.filter(msg => 
          msg.from === phone || msg.to === phone
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(phoneMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.phone);
    
    // Find matching lead
    const lead = leads.find(l => 
      l.phone === conv.phone || 
      l.phone === formatPhone(conv.phone) ||
      conv.phone.includes(l.phone?.replace(/\D/g, ''))
    );
    setSelectedLead(lead || null);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      const res = await fetch('/api/crm/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedConversation.phone,
          message: newMessage,
        }),
      });
      
      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation.phone);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSending(false);
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    if (phone.startsWith('972')) {
      return '0' + phone.substring(3);
    }
    return phone;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
  };

  const updateLeadStatus = async (status) => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/crm/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setSelectedLead({ ...selectedLead, status });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const updateLeadAssignment = async (assignedTo) => {
    if (!selectedLead) return;
    try {
      await fetch(`/api/crm/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo }),
      });
      setSelectedLead({ ...selectedLead, assignedTo });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead assignment:', error);
    }
  };

  const saveLeadNotes = async () => {
    if (!selectedLead || !newNote.trim()) return;
    try {
      const updatedNotes = selectedLead.notes 
        ? `${selectedLead.notes}\n\n[${new Date().toLocaleString('he-IL')}]\n${newNote}`
        : `[${new Date().toLocaleString('he-IL')}]\n${newNote}`;
      
      await fetch(`/api/crm/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
      setNewNote('');
      fetchLeads();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const addLeadTag = async (tag) => {
    if (!selectedLead || !tag.trim()) return;
    const newTags = [...(selectedLead.tags || []), tag.trim()];
    try {
      await fetch(`/api/crm/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      setSelectedLead({ ...selectedLead, tags: newTags });
      fetchLeads();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const snoozeLead = async (hours) => {
    if (!selectedLead) return;
    const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
    try {
      await fetch(`/api/crm/leads/${selectedLead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snoozedUntil, status: 'contacted' }),
      });
      setSelectedLead({ ...selectedLead, snoozedUntil });
      setShowSnoozeMenu(false);
      fetchLeads();
    } catch (error) {
      console.error('Error snoozing lead:', error);
    }
  };

  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users?role=admin&limit=50');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery) {
      return conv.phone.includes(searchQuery);
    }
    return true;
  });

  return (
    <div className="h-screen flex flex-col bg-white" dir="rtl">
      {/* Top Navigation - VIPO Style */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/business" className="text-xl sm:text-2xl font-bold" style={{ background: mainGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {settings?.siteName || 'VIPO'}
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-bold" style={{ color: primaryColor }}>מערכת CRM</h1>
          
          <nav className="hidden md:flex items-center gap-1 mr-4">
            {mainTabs.map(tab => (
              <button
                key={tab.id}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === tab.id ? { background: mainGradient } : {}}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Server Status & Reset Button */}
          <button
            onClick={async () => {
              if (!connected) {
                if (confirm('האם לאפס את שרת WhatsApp?')) {
                  try {
                    await fetch('/api/crm/whatsapp/reset', { method: 'POST' });
                    window.location.reload();
                  } catch (error) {
                    console.error('Reset error:', error);
                    alert('שגיאה באיפוס השרת');
                  }
                }
              }
            }}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
              connected 
                ? 'bg-green-100 hover:bg-green-200 text-green-700 cursor-default' 
                : 'bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer animate-pulse'
            }`}
            title={connected ? 'השרת מחובר' : 'לחץ לאיפוס השרת'}
          >
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-medium">{connected ? 'שרת פעיל' : 'שרת מנותק'}</span>
            {!connected && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>

          {!connected && (
            <button
              onClick={openQRModal}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg text-white transition-colors"
              style={{ background: mainGradient }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              סרוק QR
            </button>
          )}
          <Link 
            href="/business" 
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            חזרה לדשבורד
          </Link>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>חיבור WhatsApp</h3>
            <p className="text-gray-600 mb-4">סרוק את הקוד עם אפליקציית WhatsApp בטלפון</p>
            
            {/* Embed the QR page directly using iframe */}
            <iframe 
              src="http://localhost:3002/qr" 
              className="w-72 h-80 mx-auto border-0 rounded-lg"
              title="WhatsApp QR Code"
            />
            
            <p className="text-sm text-gray-500 mt-2">סרוק את הקוד עם WhatsApp בטלפון</p>
            
            <button
              onClick={() => setShowQRModal(false)}
              className="mt-4 px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tab: Inbox */}
        {activeTab === 'inbox' && (
        <>
        {/* Left Sidebar - Inbox */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* Queues */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex flex-wrap gap-1">
              {queues.map(queue => (
                <button
                  key={queue.id}
                  onClick={() => setActiveQueue(queue.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeQueue === queue.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={activeQueue === queue.id ? { background: mainGradient } : {}}
                >
                  <span className="ml-1"><QueueIcon type={queue.icon} /></span>
                  {queue.name}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                אין שיחות
              </div>
            ) : (
              filteredConversations.map((conv, idx) => (
                <div
                  key={conv.phone || idx}
                  onClick={() => selectConversation(conv)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.phone === conv.phone ? 'bg-cyan-50 border-r-4' : ''
                  }`}
                  style={selectedConversation?.phone === conv.phone ? { borderRightColor: secondaryColor } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {formatPhone(conv.phone).substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm">{formatPhone(conv.phone)}</span>
                        <span className="text-xs text-gray-500">{formatTime(conv.lastMessage?.timestamp)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.lastMessage?.type === 'outgoing' ? '← ' : ''}
                        {conv.lastMessage?.message || '[מדיה]'}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-14 px-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {formatPhone(selectedConversation.phone).substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedLead?.name || formatPhone(selectedConversation.phone)}</h2>
                    <p className="text-xs text-gray-500">{formatPhone(selectedConversation.phone)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="הערה" style={{ color: secondaryColor }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="תיוג" style={{ color: secondaryColor }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="תזכורת" style={{ color: secondaryColor }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500" title="סגור">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#f0f2f5' }}>
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex ${msg.type === 'outgoing' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                        msg.type === 'outgoing'
                          ? 'text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none'
                      }`}
                      style={msg.type === 'outgoing' ? { background: mainGradient } : {}}
                    >
                      <p className="break-words text-sm">{msg.message || '[מדיה]'}</p>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${msg.type === 'outgoing' ? 'text-cyan-100' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                        {msg.type === 'outgoing' && <span>{msg.status === 'read' ? '✓✓' : '✓'}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="הקלד הודעה..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: connected ? secondaryColor : undefined }}
                    disabled={!connected}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !connected || !newMessage.trim()}
                    className="px-6 py-2 text-white rounded-full text-sm disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                  >
                    {sending ? '...' : 'שלח'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4" style={{ color: '#0891b2', opacity: 0.3 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-lg">בחר שיחה מהרשימה</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Lead Info */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {selectedLead ? (
            <>
              {/* Lead Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold" style={{ color: '#1e3a8a' }}>פרטי ליד</h3>
                  {/* SLA Badge */}
                  {selectedLead.slaStatus && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedLead.slaStatus === 'met' ? 'bg-green-100 text-green-700' :
                      selectedLead.slaStatus === 'breached' ? 'bg-red-100 text-red-700' :
                      selectedLead.slaDeadline && new Date(selectedLead.slaDeadline) < new Date() ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedLead.slaStatus === 'met' ? 'SLA ✓' :
                       selectedLead.slaStatus === 'breached' ? 'SLA ✗' :
                       selectedLead.slaDeadline && new Date(selectedLead.slaDeadline) < new Date() ? 'SLA ✗' :
                       'ממתין'}
                    </span>
                  )}
                </div>
                
                {/* Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">סטטוס:</span>
                    <select
                      value={selectedLead.status || 'new'}
                      onChange={(e) => updateLeadStatus(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                    >
                      <option value="new">חדש</option>
                      <option value="contacted">נוצר קשר</option>
                      <option value="qualified">מתאים</option>
                      <option value="proposal">הצעה</option>
                      <option value="won">נסגר בהצלחה</option>
                      <option value="lost">לא רלוונטי</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">מקור:</span>
                    <span className="text-sm text-gray-900">{selectedLead.source || 'WhatsApp'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">נציג:</span>
                    <select
                      value={selectedLead.assignedTo?._id || selectedLead.assignedTo || ''}
                      onChange={(e) => updateLeadAssignment(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                    >
                      <option value="">לא מוקצה</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.fullName || user.email}</option>
                      ))}
                    </select>
                  </div>
                  {selectedLead.snoozedUntil && new Date(selectedLead.snoozedUntil) > new Date() && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">מושהה עד:</span>
                      <span className="text-sm text-orange-600">{new Date(selectedLead.snoozedUntil).toLocaleString('he-IL')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
                    {selectedLead.name?.substring(0, 2) || '??'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedLead.name || 'לא ידוע'}</h4>
                    <p className="text-sm text-gray-500">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span className="text-gray-600">{selectedLead.email}</span>
                    </div>
                  )}
                  {selectedLead.company && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <span className="text-gray-600">{selectedLead.company}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedLead.tags?.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'rgba(8, 145, 178, 0.15)', color: '#0891b2' }}>
                      {tag}
                    </span>
                  ))}
                  {showTagInput ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            addLeadTag(newTag);
                            setNewTag('');
                            setShowTagInput(false);
                          }
                        }}
                        className="px-2 py-0.5 text-xs border border-gray-300 rounded-full w-20"
                        placeholder="תג חדש"
                        autoFocus
                      />
                      <button 
                        onClick={() => setShowTagInput(false)}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >✕</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowTagInput(true)}
                      className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200"
                    >
                      + הוסף תג
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium" style={{ color: '#1e3a8a' }}>משימות</h4>
                  <button className="text-sm hover:underline" style={{ color: secondaryColor }}>+ הוסף</button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg text-sm">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="flex-1">התקשר חזרה</span>
                    <span className="text-xs text-orange-600">היום</span>
                  </div>
                </div>
              </div>

              {/* Snooze */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium" style={{ color: '#1e3a8a' }}>דחיית טיפול</h4>
                  <div className="relative">
                    <button 
                      onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                      className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" style={{ color: secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      השהה
                    </button>
                    {showSnoozeMenu && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-32">
                        <button onClick={() => snoozeLead(1)} className="w-full px-3 py-2 text-sm text-right hover:bg-gray-50">שעה אחת</button>
                        <button onClick={() => snoozeLead(4)} className="w-full px-3 py-2 text-sm text-right hover:bg-gray-50">4 שעות</button>
                        <button onClick={() => snoozeLead(24)} className="w-full px-3 py-2 text-sm text-right hover:bg-gray-50">מחר</button>
                        <button onClick={() => snoozeLead(48)} className="w-full px-3 py-2 text-sm text-right hover:bg-gray-50">יומיים</button>
                        <button onClick={() => snoozeLead(168)} className="w-full px-3 py-2 text-sm text-right hover:bg-gray-50">שבוע</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium" style={{ color: '#1e3a8a' }}>הערות</h4>
                </div>
                {selectedLead.notes && (
                  <div className="bg-gray-50 rounded-lg p-2 mb-3 max-h-32 overflow-y-auto">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">{selectedLead.notes}</pre>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="הוסף הערה חדשה..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                  {newNote.trim() && (
                    <button 
                      onClick={saveLeadNotes}
                      className="self-end px-4 py-1 text-white text-sm rounded-lg"
                      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                    >
                      שמור הערה
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : selectedConversation ? (
            <div className="p-4">
              <h3 className="font-semibold mb-4" style={{ color: '#1e3a8a' }}>פרטי שיחה</h3>
              <p className="text-sm text-gray-500 mb-4">מספר: {formatPhone(selectedConversation.phone)}</p>
              <button
                onClick={() => {/* Create lead */}}
                className="w-full py-2 text-white rounded-lg text-sm"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                + צור ליד חדש
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p className="text-sm">בחר שיחה לראות פרטים</p>
            </div>
          )}
        </aside>
        </>
        )}

        {/* Tab: Leads */}
        {activeTab === 'leads' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>לידים</h2>
                <button 
                  className="px-4 py-2 text-white rounded-lg text-sm flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  ליד חדש
                </button>
              </div>
              
              {/* Status Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {['', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
                  <button
                    key={status}
                    onClick={() => setLeadsFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      leadsFilter === status ? 'text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                    style={leadsFilter === status ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                  >
                    {status === '' ? 'הכל' : status === 'new' ? 'חדש' : status === 'contacted' ? 'נוצר קשר' : status === 'qualified' ? 'מתאים' : status === 'converted' ? 'הומר' : 'אבוד'}
                  </button>
                ))}
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">שם</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">טלפון</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">מקור</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">סטטוס</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">תאריך</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l => !leadsFilter || l.status === leadsFilter).map(lead => (
                      <tr key={lead._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lead.source || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                            lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                            lead.status === 'converted' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {lead.status === 'new' ? 'חדש' : lead.status === 'contacted' ? 'נוצר קשר' : lead.status === 'qualified' ? 'מתאים' : lead.status === 'converted' ? 'הומר' : 'אבוד'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString('he-IL')}</td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => { setSelectedLead(lead); setActiveTab('inbox'); }}
                            className="text-xs px-2 py-1 rounded hover:bg-gray-100"
                            style={{ color: secondaryColor }}
                          >
                            צפה
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length === 0 && (
                  <div className="p-8 text-center text-gray-500">אין לידים</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tasks */}
        {activeTab === 'tasks' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>משימות</h2>
                <button 
                  className="px-4 py-2 text-white rounded-lg text-sm flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  משימה חדשה
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 mb-4">
                {['', 'pending', 'in_progress', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setTasksFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      tasksFilter === status ? 'text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                    style={tasksFilter === status ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' } : {}}
                  >
                    {status === '' ? 'הכל' : status === 'pending' ? 'ממתין' : status === 'in_progress' ? 'בתהליך' : 'הושלם'}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.filter(t => !tasksFilter || t.status === tasksFilter).map(task => (
                  <div key={task._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-yellow-500' :
                      new Date(task.dueAt) < new Date() ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description || 'אין תיאור'}</p>
                    </div>
                    <div className="text-left">
                      <p className={`text-sm ${new Date(task.dueAt) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {new Date(task.dueAt).toLocaleDateString('he-IL')}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.status === 'completed' ? 'הושלם' : task.status === 'in_progress' ? 'בתהליך' : 'ממתין'}
                      </span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="bg-white rounded-xl p-8 text-center text-gray-500">אין משימות</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 p-6 overflow-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>Pipeline</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[
                { id: 'lead', label: 'ליד', color: '#3b82f6' },
                { id: 'contact', label: 'יצירת קשר', color: '#8b5cf6' },
                { id: 'meeting', label: 'פגישה', color: '#f59e0b' },
                { id: 'proposal', label: 'הצעה', color: '#10b981' },
                { id: 'negotiation', label: 'משא ומתן', color: '#f97316' },
                { id: 'won', label: 'נסגר ✓', color: '#22c55e' },
                { id: 'lost', label: 'אבוד ✗', color: '#ef4444' },
              ].map(stage => (
                <div key={stage.id} className="min-w-64 bg-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">{stage.label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: stage.color }}>
                      {pipelineLeads[stage.id]?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {pipelineLeads[stage.id]?.map(lead => (
                      <div 
                        key={lead._id} 
                        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => { setSelectedLead(lead); setActiveTab('inbox'); }}
                      >
                        <p className="font-medium text-sm text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                        {lead.estimatedValue > 0 && (
                          <p className="text-xs mt-1 font-medium" style={{ color: secondaryColor }}>₪{lead.estimatedValue.toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                    {(!pipelineLeads[stage.id] || pipelineLeads[stage.id].length === 0) && (
                      <div className="text-center text-gray-400 text-xs py-4">אין לידים</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

