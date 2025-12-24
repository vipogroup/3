'use client';

import { useState, useEffect } from 'react';
import { isSuperAdmin, getUserPermissions, hasPermission } from '@/lib/superAdmins';

export function usePermissions() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
        if (!ignore && res.ok) {
          const data = await res.json();
          const userData = data?.user || null;
          setUser(userData);
          
          if (userData) {
            const userPerms = getUserPermissions(userData);
            const isSuperAdmin = userData.email ? isSuperAdmin(userData.email) : false;
            
            setPermissions(userPerms);
            setIsSuperAdminUser(isSuperAdmin);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user permissions:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      ignore = true;
    };
  }, []);

  const checkPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user, permission);
  };

  return {
    user,
    loading,
    permissions,
    isSuperAdmin: isSuperAdminUser,
    hasPermission: checkPermission,
  };
}
