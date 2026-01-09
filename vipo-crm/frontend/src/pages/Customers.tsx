import { useEffect, useState } from 'react';
import { customers } from '../lib/api';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  CheckSquare,
  Loader2,
  User,
} from 'lucide-react';

export default function Customers() {
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const fetchCustomers = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      
      const res = await customers.list(params);
      setCustomersList(res.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const loadCustomer = async (id: string) => {
    try {
      const res = await customers.get(id);
      setSelectedCustomer(res.data);
    } catch (error) {
      console.error('Error loading customer:', error);
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Customers List */}
      <div className="w-96 bg-white rounded-xl shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש לקוחות..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : customersList.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              אין לקוחות
            </div>
          ) : (
            customersList.map((customer) => (
              <div
                key={customer.id}
                onClick={() => loadCustomer(customer.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedCustomer?.id === customer.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {customer.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.phone || customer.email || 'אין פרטי קשר'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{customer._count?.conversations || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Customer Detail (Customer 360) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        {selectedCustomer ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-l from-purple-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl text-purple-600 font-bold">
                    {selectedCustomer.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {selectedCustomer.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    )}
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Stats */}
                <div className="col-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.conversations?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">שיחות</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <CheckSquare className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.tasks?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">משימות פתוחות</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <User className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.lead?.agent?.name || '-'}
                    </p>
                    <p className="text-sm text-gray-500">סוכן</p>
                  </div>
                </div>

                {/* Recent Conversations */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">שיחות אחרונות</h3>
                  <div className="space-y-2">
                    {selectedCustomer.conversations?.length === 0 ? (
                      <p className="text-sm text-gray-500">אין שיחות</p>
                    ) : (
                      selectedCustomer.conversations?.slice(0, 5).map((conv: any) => (
                        <div key={conv.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{conv.subject || conv.channel}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(conv.updatedAt).toLocaleDateString('he-IL')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Open Tasks */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">משימות פתוחות</h3>
                  <div className="space-y-2">
                    {selectedCustomer.tasks?.length === 0 ? (
                      <p className="text-sm text-gray-500">אין משימות</p>
                    ) : (
                      selectedCustomer.tasks?.map((task: any) => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(task.dueAt).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Lead Info */}
                {selectedCustomer.lead && (
                  <div className="col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3">מידע מהליד</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">מקור:</span>
                          <span className="mr-2 font-medium">{selectedCustomer.lead.source || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">תאריך יצירה:</span>
                          <span className="mr-2 font-medium">
                            {new Date(selectedCustomer.lead.createdAt).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>בחר לקוח מהרשימה</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
