// Activity Logger Utility
// Logs admin/user activities for audit trail

const ACTIVITY_ENDPOINT = '/api/admin/activity-logs';

// Activity types
export const ACTIVITY_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SETTINGS: 'settings',
  BACKUP: 'backup',
  RESTORE: 'restore',
  DEPLOY: 'deploy',
  VIEW: 'view'
};

// Entity types
export const ENTITY_TYPES = {
  USER: 'user',
  PRODUCT: 'product',
  ORDER: 'order',
  AGENT: 'agent',
  SETTINGS: 'settings',
  BACKUP: 'backup',
  SYSTEM: 'system'
};

// Log activity from client
export async function logActivity(options = {}) {
  const {
    action,
    entity,
    entityId,
    userId,
    userEmail,
    description,
    metadata = {}
  } = options;

  try {
    const response = await fetch(ACTIVITY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        entity,
        entityId,
        userId,
        userEmail,
        description,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : null
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('[ActivityLogger] Failed to log activity:', error);
    return false;
  }
}

// Server-side activity logger
export async function logServerActivity(options = {}) {
  const { getDb } = await import('@/lib/db');
  
  try {
    const db = await getDb();
    
    const logEntry = {
      action: options.action,
      entity: options.entity || null,
      entityId: options.entityId || null,
      userId: options.userId || null,
      userEmail: options.userEmail || null,
      description: options.description || `${options.action} on ${options.entity || 'unknown'}`,
      metadata: options.metadata || {},
      createdAt: new Date()
    };

    await db.collection('activity_logs').insertOne(logEntry);
    return true;
  } catch (error) {
    console.error('[ActivityLogger] Failed to log server activity:', error);
    return false;
  }
}

// Helper functions for common activities
export function logUserCreated(userId, userEmail, createdByEmail) {
  return logActivity({
    action: ACTIVITY_ACTIONS.CREATE,
    entity: ENTITY_TYPES.USER,
    entityId: userId,
    userEmail: createdByEmail,
    description: `יצירת משתמש חדש: ${userEmail}`
  });
}

export function logUserUpdated(userId, userEmail, updatedByEmail, changes) {
  return logActivity({
    action: ACTIVITY_ACTIONS.UPDATE,
    entity: ENTITY_TYPES.USER,
    entityId: userId,
    userEmail: updatedByEmail,
    description: `עדכון משתמש: ${userEmail}`,
    metadata: { changes }
  });
}

export function logUserDeleted(userId, userEmail, deletedByEmail) {
  return logActivity({
    action: ACTIVITY_ACTIONS.DELETE,
    entity: ENTITY_TYPES.USER,
    entityId: userId,
    userEmail: deletedByEmail,
    description: `מחיקת משתמש: ${userEmail}`
  });
}

export function logProductCreated(productId, productName, userEmail) {
  return logActivity({
    action: ACTIVITY_ACTIONS.CREATE,
    entity: ENTITY_TYPES.PRODUCT,
    entityId: productId,
    userEmail,
    description: `יצירת מוצר חדש: ${productName}`
  });
}

export function logProductUpdated(productId, productName, userEmail, changes) {
  return logActivity({
    action: ACTIVITY_ACTIONS.UPDATE,
    entity: ENTITY_TYPES.PRODUCT,
    entityId: productId,
    userEmail,
    description: `עדכון מוצר: ${productName}`,
    metadata: { changes }
  });
}

export function logProductDeleted(productId, productName, userEmail) {
  return logActivity({
    action: ACTIVITY_ACTIONS.DELETE,
    entity: ENTITY_TYPES.PRODUCT,
    entityId: productId,
    userEmail,
    description: `מחיקת מוצר: ${productName}`
  });
}

export function logLogin(userId, userEmail) {
  return logActivity({
    action: ACTIVITY_ACTIONS.LOGIN,
    entity: ENTITY_TYPES.USER,
    entityId: userId,
    userEmail,
    description: `התחברות למערכת: ${userEmail}`
  });
}

export function logSettingsChange(userEmail, settingName, oldValue, newValue) {
  return logActivity({
    action: ACTIVITY_ACTIONS.SETTINGS,
    entity: ENTITY_TYPES.SETTINGS,
    userEmail,
    description: `שינוי הגדרות: ${settingName}`,
    metadata: { settingName, oldValue, newValue }
  });
}

export function logBackup(userEmail, backupType) {
  return logActivity({
    action: ACTIVITY_ACTIONS.BACKUP,
    entity: ENTITY_TYPES.BACKUP,
    userEmail,
    description: `גיבוי מערכת: ${backupType}`
  });
}

export function logDeploy(userEmail, environment) {
  return logActivity({
    action: ACTIVITY_ACTIONS.DEPLOY,
    entity: ENTITY_TYPES.SYSTEM,
    userEmail,
    description: `Deploy לסביבה: ${environment}`
  });
}
