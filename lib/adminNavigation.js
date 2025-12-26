/**
 * Admin Navigation Configuration with Permissions
 * Maps navigation items to required permissions
 */

import { ADMIN_PERMISSIONS } from './superAdmins';

export const ADMIN_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'לוח בקרה',
    href: '/admin',
    icon: 'dashboard',
    permission: null, // Always visible to admins
  },
  {
    id: 'users',
    label: 'משתמשים',
    href: '/admin/users',
    icon: 'users',
    permission: ADMIN_PERMISSIONS.VIEW_USERS,
  },
  {
    id: 'products',
    label: 'מוצרים',
    href: '/admin/products',
    icon: 'products',
    permission: ADMIN_PERMISSIONS.VIEW_PRODUCTS,
  },
  {
    id: 'orders',
    label: 'הזמנות',
    href: '/admin/orders',
    icon: 'orders',
    permission: ADMIN_PERMISSIONS.VIEW_ORDERS,
  },
  {
    id: 'agents',
    label: 'סוכנים',
    href: '/admin/agents',
    icon: 'agents',
    permission: ADMIN_PERMISSIONS.VIEW_AGENTS,
  },
  {
    id: 'reports',
    label: 'דוחות',
    href: '/admin/reports',
    icon: 'reports',
    permission: ADMIN_PERMISSIONS.VIEW_REPORTS,
  },
  {
    id: 'notifications',
    label: 'התראות',
    href: '/admin/notifications',
    icon: 'notifications',
    permission: ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS,
  },
  {
    id: 'transactions',
    label: 'עסקאות',
    href: '/admin/transactions',
    icon: 'transactions',
    permission: ADMIN_PERMISSIONS.VIEW_REPORTS,
  },
  {
    id: 'marketing',
    label: 'ספריית שיווק',
    href: '/admin/marketing-assets',
    icon: 'marketing',
    permission: ADMIN_PERMISSIONS.VIEW_REPORTS,
  },
  {
    id: 'settings',
    label: 'הגדרות מערכת',
    href: '/admin/settings',
    icon: 'settings',
    permission: ADMIN_PERMISSIONS.VIEW_SETTINGS,
  },
];

/**
 * Dashboard widgets configuration with permissions
 */
export const DASHBOARD_WIDGETS = [
  {
    id: 'users_stats',
    title: 'משתמשים',
    permission: ADMIN_PERMISSIONS.VIEW_USERS,
  },
  {
    id: 'products_stats',
    title: 'מוצרים',
    permission: ADMIN_PERMISSIONS.VIEW_PRODUCTS,
  },
  {
    id: 'orders_stats',
    title: 'הזמנות',
    permission: ADMIN_PERMISSIONS.VIEW_ORDERS,
  },
  {
    id: 'revenue_stats',
    title: 'הכנסות',
    permission: ADMIN_PERMISSIONS.VIEW_REPORTS,
  },
  {
    id: 'agents_stats',
    title: 'סוכנים',
    permission: ADMIN_PERMISSIONS.VIEW_AGENTS,
  },
  {
    id: 'commissions_stats',
    title: 'עמלות',
    permission: ADMIN_PERMISSIONS.VIEW_COMMISSIONS,
  },
];

/**
 * Filter navigation items based on user permissions
 * @param {Object} user - User object with email and permissions
 * @param {Function} hasPermissionFn - Function to check if user has permission
 * @returns {Array} Filtered navigation items
 */
export function getFilteredNavItems(user, hasPermissionFn) {
  if (!user || user.role !== 'admin') return [];

  return ADMIN_NAV_ITEMS.filter((item) => {
    // Items without permission requirement are always visible
    if (!item.permission) return true;
    
    // Check if user has the required permission
    return hasPermissionFn(item.permission);
  });
}

/**
 * Filter dashboard widgets based on user permissions
 * @param {Object} user - User object with email and permissions
 * @param {Function} hasPermissionFn - Function to check if user has permission
 * @returns {Array} Filtered dashboard widgets
 */
export function getFilteredDashboardWidgets(user, hasPermissionFn) {
  if (!user || user.role !== 'admin') return [];

  return DASHBOARD_WIDGETS.filter((widget) => {
    // Widgets without permission requirement are always visible
    if (!widget.permission) return true;
    
    // Check if user has the required permission
    return hasPermissionFn(widget.permission);
  });
}
