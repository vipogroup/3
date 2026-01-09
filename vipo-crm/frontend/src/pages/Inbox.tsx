import { useEffect, useState } from 'react';
import { inbox } from '../lib/api';
import {
  MessageSquare,
  Phone,
  Globe,
  Send,
  User,
  Clock,
  Loader2,
} from 'lucide-react';

const channelIcons: Record<string, any> = {
  SITE: Globe,
  WHATSAPP: MessageSquare,
  PHONE: Phone,
  INTERNAL: MessageSquare,
};

const channelLabels: Record<string, string> = {
  SITE: 'אתר',
  WHATSAPP: 'וואטסאפ',
  PHONE: 'טלפון',
  INTERNAL: 'פנימי',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: 'חדש', color: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'בטיפול', color: 'bg-yellow-100 text-yellow-800' },
  WAITING_CUSTOMER: { label: 'ממתין ללקוח', color: 'bg-purple-100 text-purple-800' },
  FOLLOW_UP: { label: 'מעקב', color: 'bg-orange-100 text-orange-800' },
  CLOSED_WON: { label: 'נסגר בהצלחה', color: 'bg-green-100 text-green-800' },
  CLOSED_LOST: { label: 'נסגר ללא הצלחה', color: 'bg-red-100 text-red-800' },
};

export default function Inbox() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchConversations = async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      
      const res = await inbox.list(params);
      setConversations(res.data.data || []);
      setStatusCounts(res.data.statusCounts || {});
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [statusFilter]);

  const loadConversation = async (id: string) => {
    try {
      const res = await inbox.get(id);
      setSelectedConversation(res.data);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await inbox.addInteraction(selectedConversation.id, {
        type: 'INTERNAL_NOTE',
        content: newMessage,
      });
      setNewMessage('');
      loadConversation(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedConversation) return;
    try {
      await inbox.update(selectedConversation.id, { status });
      loadConversation(selectedConversation.id);
      fetchConversations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getContactName = (conv: any) => {
    return conv.customer?.name || conv.lead?.name || 'לא ידוע';
  };

  const getContactInfo = (conv: any) => {
    const contact = conv.customer || conv.lead;
    return contact?.phone || contact?.email || '';
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-l flex flex-col">
        {/* Filters */}
        <div className="p-3 border-b">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">כל השיחות ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})</option>
            {Object.entries(statusLabels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label} ({statusCounts[key] || 0})
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              אין שיחות
            </div>
          ) : (
            conversations.map((conv) => {
              const ChannelIcon = channelIcons[conv.channel] || MessageSquare;
              const isSelected = selectedConversation?.id === conv.id;
              
              return (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`p-3 border-b cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${conv.status === 'NEW' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <ChannelIcon className={`w-4 h-4 ${conv.status === 'NEW' ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {getContactName(conv)}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(conv.updatedAt).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.subject || channelLabels[conv.channel]}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${statusLabels[conv.status]?.color || 'bg-gray-100'}`}>
                        {statusLabels[conv.status]?.label || conv.status}
                      </span>
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
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getContactName(selectedConversation)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getContactInfo(selectedConversation)}
                  </p>
                </div>
              </div>
              <select
                value={selectedConversation.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.interactions?.map((interaction: any) => (
                <div
                  key={interaction.id}
                  className={`flex ${interaction.type === 'INTERNAL_NOTE' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      interaction.type === 'INTERNAL_NOTE'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{interaction.content}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
                      <span>{interaction.createdBy?.name}</span>
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(interaction.createdAt).toLocaleString('he-IL')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="כתוב הערה..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>בחר שיחה מהרשימה</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
