import api from "../utils/api";

// ========== AUTHENTICATION ==========
export const authService = {
  sendOTP: (phone) => api.post("/api/auth/send-otp", { phone }),
  verifyOTP: (phone, otp) => api.post("/api/auth/verify-otp", { phone, otp }),
  completeProfile: (data) => api.post("/api/auth/complete-profile", data),
  getMe: () => api.get("/api/auth/me"),
};

// ========== INVOICES ==========
export const invoiceService = {
  getAll: (params) => api.get("/api/billing/invoices", { params }),
  getById: (id) => api.get(`/api/billing/invoices/${id}`),
  create: (data) => api.post("/api/billing/invoices", data),
  update: (id, data) => api.put(`/api/billing/invoices/${id}`, data),
  delete: (id) => api.delete(`/api/billing/invoices/${id}`),
  recover: (id) => api.post(`/api/billing/invoices/${id}/recover`),
  convert: (id) => api.post(`/api/billing/invoices/${id}/convert`),
  share: (id, method, phone, email) => api.post(`/api/billing/invoices/${id}/share`, { method, phone, email }),
  updatePayment: (id, paidAmount) => api.post(`/api/billing/invoices/${id}/payment`, { paidAmount }),
};

// ========== CUSTOMERS ==========
export const customerService = {
  getAll: () => api.get("/api/billing/customers"),
  getById: (id) => api.get(`/api/billing/customers/${id}`),
  create: (data) => api.post("/api/billing/customers", data),
  update: (id, data) => api.put(`/api/billing/customers/${id}`, data),
  delete: (id) => api.delete(`/api/billing/customers/${id}`),
};

// ========== PRODUCTS ==========
export const productService = {
  getAll: () => api.get("/api/billing/products"),
  getById: (id) => api.get(`/api/billing/products/${id}`),
  create: (data) => api.post("/api/billing/products", data),
  update: (id, data) => api.put(`/api/billing/products/${id}`, data),
  delete: (id) => api.delete(`/api/billing/products/${id}`),
  searchByBarcode: (barcode) => api.get(`/api/billing/inventory/search/barcode/${barcode}`),
};

// ========== WAREHOUSES ==========
export const warehouseService = {
  getAll: () => api.get("/api/billing/warehouses"),
  getById: (id) => api.get(`/api/billing/warehouses/${id}`),
  create: (data) => api.post("/api/billing/warehouses", data),
  update: (id, data) => api.put(`/api/billing/warehouses/${id}`, data),
  delete: (id) => api.delete(`/api/billing/warehouses/${id}`),
};

// ========== INVENTORY ==========
export const inventoryService = {
  getAll: (params) => api.get("/api/billing/inventory", { params }),
  getById: (id) => api.get(`/api/billing/inventory/${id}`),
  create: (data) => api.post("/api/billing/inventory", data),
  update: (id, data) => api.put(`/api/billing/inventory/${id}`, data),
  adjust: (id, data) => api.post(`/api/billing/inventory/${id}/adjust`, data),
  getLowStockAlerts: () => api.get("/api/billing/inventory/alerts/low-stock"),
  searchByBarcode: (barcode) => api.get(`/api/billing/inventory/search/barcode/${barcode}`),
};

// ========== RECURRING INVOICES ==========
export const recurringService = {
  getAll: (params) => api.get("/api/billing/recurring", { params }),
  getById: (id) => api.get(`/api/billing/recurring/${id}`),
  create: (data) => api.post("/api/billing/recurring", data),
  update: (id, data) => api.put(`/api/billing/recurring/${id}`, data),
  delete: (id) => api.delete(`/api/billing/recurring/${id}`),
  generate: (id) => api.post(`/api/billing/recurring/${id}/generate`),
  pause: (id) => api.post(`/api/billing/recurring/${id}/pause`),
  resume: (id) => api.post(`/api/billing/recurring/${id}/resume`),
  cancel: (id) => api.post(`/api/billing/recurring/${id}/cancel`),
};

// ========== REPORTS ==========
export const reportService = {
  profitLoss: (params) => api.get("/api/billing/reports/profit-loss", { params }),
  balanceSheet: (params) => api.get("/api/billing/reports/balance-sheet", { params }),
  ledger: (params) => api.get("/api/billing/reports/ledger", { params }),
  sales: (params) => api.get("/api/billing/reports/sales", { params }),
  outstanding: (params) => api.get("/api/billing/reports/outstanding", { params }),
};

// ========== GST ==========
export const gstService = {
  gstr1: (params) => api.get("/api/billing/gst/gstr1", { params }),
  gstr3b: (params) => api.get("/api/billing/gst/gstr3b", { params }),
  export: (type, format) => api.get(`/api/billing/gst/export?type=${type}&format=${format}`),
};

// ========== STAFF ==========
export const staffService = {
  getAll: () => api.get("/api/billing/staff"),
  getById: (id) => api.get(`/api/billing/staff/${id}`),
  invite: (data) => api.post("/api/billing/staff/invite", data),
  update: (id, data) => api.put(`/api/billing/staff/${id}`, data),
  updatePermissions: (id, permissions) => api.put(`/api/billing/staff/${id}/permissions`, { permissions }),
  delete: (id) => api.delete(`/api/billing/staff/${id}`),
  getMe: () => api.get("/api/billing/staff/me"),
};

// ========== TEMPLATES ==========
export const templateService = {
  getAll: () => api.get("/api/billing/templates"),
  getDefault: () => api.get("/api/billing/templates/default"),
  getById: (id) => api.get(`/api/billing/templates/${id}`),
  create: (data) => api.post("/api/billing/templates", data),
  update: (id, data) => api.put(`/api/billing/templates/${id}`, data),
  delete: (id) => api.delete(`/api/billing/templates/${id}`),
  duplicate: (id) => api.post(`/api/billing/templates/${id}/duplicate`),
  setDefault: (id) => api.post(`/api/billing/templates/${id}/set-default`),
  preview: (id) => api.get(`/api/billing/templates/${id}/preview`),
};

// ========== BULK OPERATIONS ==========
export const bulkService = {
  uploadProducts: (products) => api.post("/api/billing/bulk/products/upload", { products }),
  uploadCustomers: (customers) => api.post("/api/billing/bulk/customers/upload", { customers }),
  updateProducts: (products) => api.post("/api/billing/bulk/products/update", { products }),
  updateCustomers: (customers) => api.post("/api/billing/bulk/customers/update", { customers }),
  updateInventory: (inventory) => api.post("/api/billing/bulk/inventory/update", { inventory }),
  deleteProducts: (ids) => api.post("/api/billing/bulk/products/delete", { ids }),
  deleteCustomers: (ids) => api.post("/api/billing/bulk/customers/delete", { ids }),
  exportProducts: (format) => api.get(`/api/billing/bulk/products/export?format=${format}`),
  exportCustomers: (format) => api.get(`/api/billing/bulk/customers/export?format=${format}`),
};

// ========== BUSINESSES ==========
export const businessService = {
  getAll: () => api.get("/api/billing/businesses"),
  getDefault: () => api.get("/api/billing/businesses/default"),
  getById: (id) => api.get(`/api/billing/businesses/${id}`),
  create: (data) => api.post("/api/billing/businesses", data),
  update: (id, data) => api.put(`/api/billing/businesses/${id}`, data),
  delete: (id) => api.delete(`/api/billing/businesses/${id}`),
  setDefault: (id) => api.post(`/api/billing/businesses/${id}/set-default`),
  switch: (id) => api.post(`/api/billing/businesses/${id}/switch`),
};

// ========== SUPPLIERS ==========
export const supplierService = {
  getAll: () => api.get("/api/billing/suppliers"),
  getById: (id) => api.get(`/api/billing/suppliers/${id}`),
  create: (data) => api.post("/api/billing/suppliers", data),
  update: (id, data) => api.put(`/api/billing/suppliers/${id}`, data),
  delete: (id) => api.delete(`/api/billing/suppliers/${id}`),
};

// ========== PURCHASES ==========
export const purchaseService = {
  getAll: (params) => api.get("/api/billing/purchases", { params }),
  getById: (id) => api.get(`/api/billing/purchases/${id}`),
  create: (data) => api.post("/api/billing/purchases", data),
  update: (id, data) => api.put(`/api/billing/purchases/${id}`, data),
  delete: (id) => api.delete(`/api/billing/purchases/${id}`),
  updatePayment: (id, paidAmount) => api.post(`/api/billing/purchases/${id}/payment`, { paidAmount }),
};

// ========== CAMPAIGNS ==========
export const campaignService = {
  getAll: (params) => api.get("/api/billing/campaigns", { params }),
  getById: (id) => api.get(`/api/billing/campaigns/${id}`),
  create: (data) => api.post("/api/billing/campaigns", data),
  update: (id, data) => api.put(`/api/billing/campaigns/${id}`, data),
  delete: (id) => api.delete(`/api/billing/campaigns/${id}`),
  send: (id) => api.post(`/api/billing/campaigns/${id}/send`),
};

// ========== LOYALTY ==========
export const loyaltyService = {
  getAll: (params) => api.get("/api/billing/loyalty", { params }),
  getById: (id) => api.get(`/api/billing/loyalty/${id}`),
  getByCustomer: (customerId) => api.get(`/api/billing/loyalty/customer/${customerId}`),
  earn: (data) => api.post("/api/billing/loyalty/earn", data),
  redeem: (data) => api.post("/api/billing/loyalty/redeem", data),
  adjust: (data) => api.post("/api/billing/loyalty/adjust", data),
  updateSettings: (id, settings) => api.put(`/api/billing/loyalty/${id}/settings`, { settings }),
};

// ========== E-INVOICE & E-WAY BILL ==========
export const einvoiceService = {
  generate: (invoiceId) => api.post("/api/billing/einvoice/generate", { invoiceId }),
  generateEWayBill: (data) => api.post("/api/billing/ewaybill/generate", data),
  cancelEWayBill: (invoiceId, reason) => api.post("/api/billing/ewaybill/cancel", { invoiceId, reason }),
};

// ========== STATS ==========
export const statsService = {
  getStats: (params) => api.get("/api/billing/stats", { params }),
};

