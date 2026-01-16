'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Context to share selected tenant across components
const TenantContext = createContext(null);

export function useTenant() {
  return useContext(TenantContext);
}

export function TenantProvider({ children }) {
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const res = await fetch('/api/agent/businesses', { credentials: 'include' });
      const data = await res.json();
      if (data.ok && data.businesses?.length > 0) {
        setBusinesses(data.businesses);
        // Auto-select first business
        setSelectedTenantId(data.businesses[0].tenantId);
      }
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedBusiness = businesses.find(b => b.tenantId === selectedTenantId);

  return (
    <TenantContext.Provider value={{
      selectedTenantId,
      setSelectedTenantId,
      selectedBusiness,
      businesses,
      loading,
      hasMultipleBusinesses: businesses.length > 1,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export default function AgentDashboardClient({ children }) {
  return (
    <TenantProvider>
      {children}
    </TenantProvider>
  );
}
