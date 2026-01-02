/**
 * Priority ERP Integration Client
 * 
 * מספק ממשק לאינטראקציה עם מערכת Priority ERP
 * כולל: לקוחות, הזמנות, חשבוניות, קבלות, וזיכויים
 */

import { getPriorityConfig, validatePriorityConfig } from './config.js';

/**
 * Priority API Client Class
 */
class PriorityClient {
  constructor(config = null) {
    this.config = config || getPriorityConfig();
    this.baseUrl = this.config.baseUrl;
    this.companyCode = this.config.companyCode;
    this.timeout = this.config.timeout || 45000;
    this.retries = this.config.retries || 3;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get authentication token
   */
  async authenticate() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await this.rawRequest('/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    this.accessToken = response.access_token;
    // Set expiry 5 minutes before actual expiry
    this.tokenExpiry = new Date(Date.now() + (response.expires_in - 300) * 1000);
    
    return this.accessToken;
  }

  /**
   * Raw HTTP request without authentication
   */
  async rawRequest(endpoint, options = {}) {
    const url = new URL(endpoint, this.baseUrl).toString();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Priority API error (${response.status}): ${text}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Authenticated API request
   */
  async request(endpoint, options = {}) {
    const token = await this.authenticate();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    let lastError;
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        return await this.rawRequest(endpoint, { ...options, headers });
      } catch (err) {
        lastError = err;
        if (attempt < this.retries) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }
    throw lastError;
  }

  // ========== Customer Methods ==========

  /**
   * Find customer by query
   */
  async findCustomer(query) {
    const { email, phone, vatId } = query;
    
    // Build OData filter
    const filters = [];
    if (email) filters.push(`EMAIL eq '${email}'`);
    if (phone) filters.push(`PHONE eq '${phone}'`);
    if (vatId) filters.push(`WTAXNUM eq '${vatId}'`);
    
    if (filters.length === 0) return null;

    const filter = filters.join(' or ');
    const response = await this.request(
      `/odata/Priority/${this.companyCode}/CUSTOMERS?$filter=${encodeURIComponent(filter)}`
    );

    return response.value?.[0] || null;
  }

  /**
   * Create new customer
   */
  async createCustomer(data) {
    const customerData = {
      CUSTNAME: data.customerId || `WEB${Date.now()}`,
      CUSTDES: data.name,
      EMAIL: data.email,
      PHONE: data.phone,
      WTAXNUM: data.vatId || null,
      ADDRESS: data.address,
      STESSION: data.city,
      ZIP: data.zipCode,
      COUNTRYNAME: data.country || 'ישראל',
      PAYMENTDEF: 'T', // Default payment terms
      VATFLAG: data.vatId ? 'Y' : 'N',
    };

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/CUSTOMERS`,
      {
        method: 'POST',
        body: JSON.stringify(customerData),
      }
    );

    return {
      id: response.CUSTNAME,
      name: response.CUSTDES,
      ...response,
    };
  }

  /**
   * Update existing customer
   */
  async updateCustomer(customerId, data) {
    const updateData = {};
    if (data.name) updateData.CUSTDES = data.name;
    if (data.email) updateData.EMAIL = data.email;
    if (data.phone) updateData.PHONE = data.phone;
    if (data.address) updateData.ADDRESS = data.address;
    if (data.city) updateData.STESSION = data.city;
    if (data.zipCode) updateData.ZIP = data.zipCode;

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/CUSTOMERS('${customerId}')`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }
    );

    return response;
  }

  // ========== Sales Order Methods ==========

  /**
   * Create sales order
   */
  async createSalesOrder(data) {
    const orderData = {
      CUSTNAME: data.customerId,
      ORDNAME: data.externalRef ? `WEB-${data.externalRef}` : `WEB${Date.now()}`,
      CURDATE: formatPriorityDate(data.orderDate || new Date()),
      DETAILS: data.notes || '',
      ORDERITEMS_SUBFORM: data.lines.map(line => ({
        PARTNAME: line.itemCode,
        TQUANT: line.quantity,
        PRICE: line.price,
        QPRICE: line.totalPrice || (line.price * line.quantity),
        PERCENT: line.discount || 0,
      })),
    };

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/ORDERS`,
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      }
    );

    return {
      id: response.ORDNAME,
      number: response.ORDNUM,
      ...response,
    };
  }

  /**
   * Get sales order by ID
   */
  async getSalesOrder(orderId) {
    const response = await this.request(
      `/odata/Priority/${this.companyCode}/ORDERS('${orderId}')?$expand=ORDERITEMS_SUBFORM`
    );
    return response;
  }

  // ========== Invoice Methods ==========

  /**
   * Create tax invoice
   */
  async createInvoice(data) {
    const invoiceData = {
      CUSTNAME: data.customerId,
      IVTYPE: 'A', // Tax invoice
      CURDATE: formatPriorityDate(data.invoiceDate || new Date()),
      DETAILS: data.notes || '',
      TPAYMENT_SUBFORM: data.payment ? [{
        PAYMENTCODE: data.payment.method || 'CC',
        QPRICE: data.payment.amount,
        PAYDATE: formatPriorityDate(data.payment.date || new Date()),
        PAYACCOUNT: data.payment.reference || '',
      }] : [],
      INVOICEITEMS_SUBFORM: data.lines.map(line => ({
        PARTNAME: line.itemCode,
        TQUANT: line.quantity,
        PRICE: line.price,
        QPRICE: line.totalPrice || (line.price * line.quantity),
        PERCENT: line.discount || 0,
      })),
    };

    if (data.fromOrderId) {
      invoiceData.ORDNAME = data.fromOrderId;
    }

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/AINVOICES`,
      {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      }
    );

    return {
      id: response.IVNUM,
      number: response.IVNUM,
      type: 'invoice',
      ...response,
    };
  }

  // ========== Receipt Methods ==========

  /**
   * Create receipt
   */
  async createReceipt(data) {
    const receiptData = {
      CUSTNAME: data.customerId,
      CURDATE: formatPriorityDate(data.receiptDate || new Date()),
      DETAILS: data.notes || '',
      TPAYMENT_SUBFORM: [{
        PAYMENTCODE: data.payment?.method || 'CC',
        QPRICE: data.amount,
        PAYDATE: formatPriorityDate(data.payment?.date || new Date()),
        PAYACCOUNT: data.payment?.reference || '',
      }],
    };

    if (data.invoiceId) {
      receiptData.IVNUM = data.invoiceId;
    }

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/RECEIPTS`,
      {
        method: 'POST',
        body: JSON.stringify(receiptData),
      }
    );

    return {
      id: response.RECEIPT,
      number: response.RECEIPT,
      type: 'receipt',
      ...response,
    };
  }

  // ========== Credit Note Methods ==========

  /**
   * Create credit note (for refunds)
   */
  async createCreditNote(data) {
    const creditData = {
      CUSTNAME: data.customerId,
      IVTYPE: 'C', // Credit note
      CURDATE: formatPriorityDate(data.creditDate || new Date()),
      DETAILS: data.reason || 'זיכוי',
      INVOICEITEMS_SUBFORM: data.lines.map(line => ({
        PARTNAME: line.itemCode,
        TQUANT: line.quantity,
        PRICE: line.price,
        QPRICE: line.totalPrice || (line.price * line.quantity),
      })),
    };

    if (data.originalInvoiceId) {
      creditData.ORIGINV = data.originalInvoiceId;
    }

    const response = await this.request(
      `/odata/Priority/${this.companyCode}/CINVOICES`,
      {
        method: 'POST',
        body: JSON.stringify(creditData),
      }
    );

    return {
      id: response.IVNUM,
      number: response.IVNUM,
      type: 'credit_note',
      ...response,
    };
  }

  // ========== Product Methods ==========

  /**
   * Get product by item code
   */
  async getProduct(itemCode) {
    const response = await this.request(
      `/odata/Priority/${this.companyCode}/LOGPART('${itemCode}')`
    );
    return response;
  }

  /**
   * Sync products from Priority
   */
  async syncProducts(options = {}) {
    const { filter, top = 1000 } = options;
    
    let url = `/odata/Priority/${this.companyCode}/LOGPART?$top=${top}`;
    if (filter) {
      url += `&$filter=${encodeURIComponent(filter)}`;
    }

    const response = await this.request(url);
    return response.value || [];
  }

  // ========== Utility Methods ==========

  /**
   * Test connection to Priority
   */
  async testConnection() {
    try {
      await this.authenticate();
      // Try to fetch company info
      await this.request(`/odata/Priority/${this.companyCode}/COMPANIES?$top=1`);
      return { connected: true, message: 'Connection successful' };
    } catch (err) {
      return { connected: false, message: err.message };
    }
  }
}

// ========== Helper Functions ==========

/**
 * Format date for Priority API (YYYY-MM-DD)
 */
function formatPriorityDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// ========== Singleton & Factory ==========

let clientInstance = null;

/**
 * Get Priority client singleton
 */
export function getPriorityClient(forceNew = false) {
  if (!clientInstance || forceNew) {
    const validation = validatePriorityConfig();
    if (!validation.ok) {
      console.warn('[PRIORITY] Not configured:', validation.missing.join(', '));
      return null;
    }
    clientInstance = new PriorityClient();
  }
  return clientInstance;
}

/**
 * Check if Priority is configured
 */
export function isPriorityConfigured() {
  return validatePriorityConfig().ok;
}

export { PriorityClient };
export default PriorityClient;
