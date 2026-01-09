import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
};

export const leads = {
  list: (params?: Record<string, string>) => api.get('/leads', { params }),
  get: (id: string) => api.get(`/leads/${id}`),
  create: (data: any) => api.post('/leads', data),
  update: (id: string, data: any) => api.patch(`/leads/${id}`, data),
  convert: (id: string) => api.post(`/leads/${id}/convert`),
  delete: (id: string) => api.delete(`/leads/${id}`),
};

export const customers = {
  list: (params?: Record<string, string>) => api.get('/customers', { params }),
  get: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.patch(`/customers/${id}`, data),
  timeline: (id: string) => api.get(`/customers/${id}/timeline`),
};

export const inbox = {
  list: (params?: Record<string, string>) => api.get('/inbox', { params }),
  get: (id: string) => api.get(`/conversations/${id}`),
  create: (data: any) => api.post('/conversations', data),
  update: (id: string, data: any) => api.patch(`/conversations/${id}`, data),
  addInteraction: (id: string, data: any) =>
    api.post(`/conversations/${id}/interactions`, data),
  assign: (id: string, userId?: string) =>
    api.post(`/conversations/${id}/assign`, { userId }),
};

export const tasks = {
  list: (params?: Record<string, string>) => api.get('/tasks', { params }),
  myTasks: () => api.get('/my-tasks'),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.patch(`/tasks/${id}`, data),
  complete: (id: string) => api.post(`/tasks/${id}/complete`),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const agents = {
  list: (params?: Record<string, string>) => api.get('/agents', { params }),
  get: (id: string) => api.get(`/agents/${id}`),
  create: (data: any) => api.post('/agents', data),
  update: (id: string, data: any) => api.patch(`/agents/${id}`, data),
  regenerateCodes: (id: string) => api.post(`/agents/${id}/regenerate-codes`),
};

export const businesses = {
  list: () => api.get('/businesses'),
  get: (id: string) => api.get(`/businesses/${id}`),
  create: (data: any) => api.post('/businesses', data),
  update: (id: string, data: any) => api.patch(`/businesses/${id}`, data),
};

export const whatsapp = {
  status: () => api.get('/whatsapp/status'),
  send: (to: string, body: string, leadId?: string, conversationId?: string) =>
    api.post('/whatsapp/send', { to, body, leadId, conversationId }),
  sendTemplate: (to: string, templateName: string, variables?: Record<string, string>) =>
    api.post('/whatsapp/send-template', { to, templateName, variables }),
  sendToLead: (leadId: string, message?: string, templateName?: string) =>
    api.post(`/leads/${leadId}/whatsapp`, { message, templateName }),
};

export const webhooks = {
  health: () => api.get('/webhooks/health'),
};

export default api;
