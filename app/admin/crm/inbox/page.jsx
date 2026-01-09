'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Phone,
  Mail,
  Globe,
  Send,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';

const STATUS_LABELS = {
  new: { label: 'חדש', color: 'bg-blue-100 text-blue-800' },
  open: { label: 'פתוח', color: 'bg-yellow-100 text-yellow-800' },
  pending: { label: 'ממתין', color: 'bg-orange-100 text-orange-800' },
  resolved: { label: 'נפתר', color: 'bg-green-100 text-green-800' },
  closed: { label: 'סגור', color: 'bg-gray-100 text-gray-800' },
};

const CHANNEL_ICONS = {
  website: Globe,
  whatsapp: MessageSquare,
  phone: Phone,
  email: Mail,
  internal: User,
};

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    channel: '',
  });
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.channel) params.set('channel', filters.channel);

      const res = await fetch(`/api/crm/conversations?${params}`);
      const data = await res.json();
      
      setConversations(data.conversations || []);
      setStatusCounts(data.statusCounts || {});
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.channel]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectConversation = async (conv) => {
    try {
      const res = await fetch(`/api/crm/conversations/${conv._id}`);
      const data = await res.json();
      setSelectedConversation(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await fetch(`/api/crm/conversations/${selectedConversation._id}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          direction: 'outbound',
          content: newMessage,
        }),
      });

      setNewMessage('');
      handleSelectConversation(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedConversation) return;

    try {
      await fetch(`/api/crm/conversations/${selectedConversation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      fetchConversations();
      handleSelectConversation(selectedConversation);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            תיבת דואר
          </h1>
          
          {/* Status Filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilters(f => ({ ...f, status: '' }))}
              className={`px-2 py-1 text-xs rounded ${
                !filters.status ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              הכל
            </button>
            {Object.entries(STATUS_LABELS).slice(0, 3).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setFilters(f => ({ ...f, status: key }))}
                className={`px-2 py-1 text-xs rounded ${
                  filters.status === key ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {label} ({statusCounts[key] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">טוען...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">אין שיחות</div>
          ) : (
            conversations.map((conv) => {
              const ChannelIcon = CHANNEL_ICONS[conv.channel] || MessageSquare;
              const isSelected = selectedConversation?._id === conv._id;
              
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      conv.status === 'new' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <ChannelIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {conv.contactName || conv.leadId?.name || 'לא ידוע'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_LABELS[conv.status]?.color}`}>
                          {STATUS_LABELS[conv.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.subject || conv.contactPhone || 'ללא נושא'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {selectedConversation.contactName || selectedConversation.leadId?.name || 'לא ידוע'}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedConversation.contactPhone || selectedConversation.leadId?.phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedConversation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-1 rounded text-sm ${STATUS_LABELS[selectedConversation.status]?.color}`}
                >
                  {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.interactions?.map((interaction, idx) => (
                <div
                  key={idx}
                  className={`flex ${interaction.direction === 'outbound' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    interaction.direction === 'outbound'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{interaction.content}</p>
                    <div className={`text-xs mt-1 ${
                      interaction.direction === 'outbound' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {interaction.createdBy?.fullName || 'מערכת'} • {new Date(interaction.createdAt).toLocaleString('he-IL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="הקלד הודעה..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>בחר שיחה לצפייה</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
