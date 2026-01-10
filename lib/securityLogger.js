// Security Logger - Tracks suspicious activities and security events
import dbConnect from '@/lib/mongodb';
import SecurityAlert from '@/models/SecurityAlert';
import ActivityLog from '@/models/ActivityLog';
import ErrorLog from '@/models/ErrorLog';

// Track failed login attempts per IP
const failedLoginAttempts = new Map();
const BRUTE_FORCE_THRESHOLD = 5;
const BRUTE_FORCE_WINDOW = 15 * 60 * 1000; // 15 minutes

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of failedLoginAttempts.entries()) {
    if (now - data.firstAttempt > BRUTE_FORCE_WINDOW) {
      failedLoginAttempts.delete(ip);
    }
  }
}, 60 * 1000); // Every minute

// Log activity
export async function logActivity(data) {
  try {
    await dbConnect();
    await ActivityLog.create({
      action: data.action,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole,
      details: data.details,
      path: data.path,
      method: data.method,
      ip: data.ip,
      userAgent: data.userAgent,
      statusCode: data.statusCode,
      responseTime: data.responseTime,
      metadata: data.metadata
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// Log error
export async function logError(data) {
  try {
    await dbConnect();
    await ErrorLog.create({
      message: data.message,
      stack: data.stack,
      path: data.path,
      method: data.method,
      statusCode: data.statusCode,
      userId: data.userId,
      ip: data.ip,
      userAgent: data.userAgent,
      requestBody: data.requestBody,
      requestQuery: data.requestQuery,
      responseBody: data.responseBody,
      severity: data.severity || 'medium',
      metadata: data.metadata
    });
  } catch (error) {
    console.error('Failed to log error:', error);
  }
}

// Log security alert
export async function logSecurityAlert(data) {
  try {
    await dbConnect();
    await SecurityAlert.create({
      type: data.type,
      message: data.message,
      ip: data.ip,
      userId: data.userId,
      userEmail: data.userEmail,
      path: data.path,
      method: data.method,
      userAgent: data.userAgent,
      country: data.country,
      city: data.city,
      severity: data.severity || 'medium',
      metadata: data.metadata
    });
  } catch (error) {
    console.error('Failed to log security alert:', error);
  }
}

// Track failed login attempt
export async function trackFailedLogin(ip, email, userAgent) {
  const now = Date.now();
  
  if (!failedLoginAttempts.has(ip)) {
    failedLoginAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      emails: [email]
    });
  } else {
    const data = failedLoginAttempts.get(ip);
    data.count++;
    if (!data.emails.includes(email)) {
      data.emails.push(email);
    }
    
    // Check for brute force attack
    if (data.count >= BRUTE_FORCE_THRESHOLD) {
      await logSecurityAlert({
        type: 'brute_force',
        message: `זוהו ${data.count} נסיונות התחברות כושלים מכתובת IP: ${ip}`,
        ip,
        userEmail: data.emails.join(', '),
        userAgent,
        severity: 'high',
        metadata: {
          attemptCount: data.count,
          emails: data.emails,
          timeWindow: now - data.firstAttempt
        }
      });
      
      // Reset after alerting
      failedLoginAttempts.delete(ip);
      return true; // Indicates brute force detected
    }
  }
  
  // Log individual failed login
  await logSecurityAlert({
    type: 'failed_login',
    message: `נסיון התחברות כושל עבור: ${email}`,
    ip,
    userEmail: email,
    userAgent,
    severity: 'low',
    metadata: {
      attemptNumber: failedLoginAttempts.get(ip)?.count || 1
    }
  });
  
  return false;
}

// Clear failed login attempts on successful login
export function clearFailedLogins(ip) {
  failedLoginAttempts.delete(ip);
}

// Check for suspicious patterns in request
export function checkSuspiciousRequest(request) {
  const url = request.url || '';
  const body = request.body || {};
  
  const suspiciousPatterns = [
    // SQL Injection patterns
    /(\bor\b|\band\b).*[=<>]/i,
    /union.*select/i,
    /insert.*into/i,
    /delete.*from/i,
    /drop.*table/i,
    /--/,
    /\/\*/,
    
    // XSS patterns
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    
    // Path traversal
    /\.\.\//,
    /\.\.\\/, 
    
    // Command injection
    /[;&|`$]/,
  ];
  
  const checkString = url + JSON.stringify(body);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      return {
        suspicious: true,
        type: pattern.source.includes('select') ? 'sql_injection' : 
              pattern.source.includes('script') ? 'xss_attempt' : 'suspicious_request',
        pattern: pattern.source
      };
    }
  }
  
  return { suspicious: false };
}

// Export middleware helper
export async function securityMiddleware(request, ip, userAgent) {
  const suspiciousCheck = checkSuspiciousRequest(request);
  
  if (suspiciousCheck.suspicious) {
    await logSecurityAlert({
      type: suspiciousCheck.type,
      message: `זוהתה בקשה חשודה: ${suspiciousCheck.type}`,
      ip,
      path: request.url,
      method: request.method,
      userAgent,
      severity: 'critical',
      metadata: {
        pattern: suspiciousCheck.pattern,
        url: request.url
      }
    });
    
    return false; // Block request
  }
  
  return true; // Allow request
}

export default {
  logActivity,
  logError,
  logSecurityAlert,
  trackFailedLogin,
  clearFailedLogins,
  checkSuspiciousRequest,
  securityMiddleware
};
