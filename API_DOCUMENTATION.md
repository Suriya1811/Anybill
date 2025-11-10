# MyBillPro - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes (`/api/auth`)

### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "needsProfileCompletion": false,
  "user": { ... }
}
```

### Complete Profile
```http
POST /api/auth/complete-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "businessName": "My Business",
  "businessType": "Retail",
  "gstin": "27ABCDE1234F1Z5",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📄 Invoice Routes (`/api/billing/invoices`)

### Get All Invoices
```http
GET /api/billing/invoices?status=paid&documentType=invoice&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Get Single Invoice
```http
GET /api/billing/invoices/:id
Authorization: Bearer <token>
```

### Create Invoice/Document
```http
POST /api/billing/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer_id",
  "documentType": "invoice", // invoice, delivery_challan, proforma_invoice, quotation, estimate
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-01-22",
  "items": [
    {
      "name": "Product 1",
      "quantity": 2,
      "price": 1000,
      "taxRate": 18,
      "taxType": "GST",
      "hsn": "12345678",
      "unit": "Piece"
    }
  ],
  "discount": 0,
  "discountType": "fixed",
  "notes": "Thank you!",
  "terms": "Payment due in 7 days",
  "currency": "INR",
  "exchangeRate": 1
}
```

### Update Invoice
```http
PUT /api/billing/invoices/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "sent",
  "notes": "Updated notes"
}
```

### Share Invoice
```http
POST /api/billing/invoices/:id/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "method": "whatsapp", // whatsapp, sms, email
  "phone": "+919876543210",
  "email": "customer@example.com"
}
```

### Convert Quotation to Invoice
```http
POST /api/billing/invoices/:id/convert
Authorization: Bearer <token>
```

### Recover Deleted Invoice
```http
POST /api/billing/invoices/:id/recover
Authorization: Bearer <token>
```

### Update Payment
```http
POST /api/billing/invoices/:id/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paidAmount": 1000
}
```

### Delete Invoice
```http
DELETE /api/billing/invoices/:id
Authorization: Bearer <token>
```

---

## 👥 Customer Routes (`/api/billing/customers`)

### Get All Customers
```http
GET /api/billing/customers
Authorization: Bearer <token>
```

### Get Single Customer
```http
GET /api/billing/customers/:id
Authorization: Bearer <token>
```

### Create Customer
```http
POST /api/billing/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Customer Name",
  "phone": "+919876543210",
  "email": "customer@example.com",
  "gstin": "27ABCDE1234F1Z5",
  "address": {
    "street": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "creditLimit": 50000
}
```

### Update Customer
```http
PUT /api/billing/customers/:id
Authorization: Bearer <token>
```

### Delete Customer
```http
DELETE /api/billing/customers/:id
Authorization: Bearer <token>
```

---

## 📦 Product Routes (`/api/billing/products`)

### Get All Products
```http
GET /api/billing/products
Authorization: Bearer <token>
```

### Create Product
```http
POST /api/billing/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU001",
  "description": "Product description",
  "category": "Electronics",
  "hsn": "12345678",
  "price": 1000,
  "cost": 800,
  "taxRate": 18,
  "taxType": "GST",
  "unit": "Piece",
  "barcode": "1234567890123",
  "barcodeType": "EAN13",
  "stock": {
    "quantity": 100,
    "lowStockAlert": 10,
    "trackInventory": true
  }
}
```

---

## 🏢 Warehouse Routes (`/api/billing/warehouses`)

### Get All Warehouses
```http
GET /api/billing/warehouses
Authorization: Bearer <token>
```

### Create Warehouse
```http
POST /api/billing/warehouses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Main Warehouse",
  "code": "WH001",
  "address": {
    "street": "123 Warehouse St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "contact": {
    "phone": "+919876543210",
    "email": "warehouse@example.com",
    "managerName": "Manager Name"
  },
  "isDefault": true
}
```

---

## 📊 Inventory Routes (`/api/billing/inventory`)

### Get All Inventory
```http
GET /api/billing/inventory?warehouseId=xxx&productId=xxx&lowStock=true
Authorization: Bearer <token>
```

### Create/Update Inventory
```http
POST /api/billing/inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "warehouseId": "warehouse_id",
  "quantity": 100,
  "reservedQuantity": 10,
  "lowStockThreshold": 20,
  "batches": [
    {
      "batchNumber": "BATCH001",
      "expiryDate": "2025-12-31",
      "quantity": 50,
      "manufacturingDate": "2024-01-01"
    }
  ],
  "serialNumbers": [
    {
      "serialNumber": "SN001",
      "status": "available"
    }
  ]
}
```

### Adjust Inventory
```http
POST /api/billing/inventory/:id/adjust
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 10,
  "type": "add", // add, remove, set
  "reason": "Stock received",
  "notes": "Additional stock"
}
```

### Get Low Stock Alerts
```http
GET /api/billing/inventory/alerts/low-stock
Authorization: Bearer <token>
```

### Search by Barcode
```http
GET /api/billing/inventory/search/barcode/:barcode
Authorization: Bearer <token>
```

---

## 🔄 Recurring Billing Routes (`/api/billing/recurring`)

### Get All Recurring Invoices
```http
GET /api/billing/recurring?status=active
Authorization: Bearer <token>
```

### Create Recurring Invoice
```http
POST /api/billing/recurring
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly Subscription",
  "customerId": "customer_id",
  "template": {
    "items": [
      {
        "name": "Service",
        "quantity": 1,
        "price": 1000,
        "taxRate": 18,
        "taxType": "GST"
      }
    ],
    "discount": 0,
    "discountType": "fixed"
  },
  "frequency": "monthly", // daily, weekly, monthly, quarterly, yearly
  "interval": 1,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "autoSend": true
}
```

### Generate Invoice from Recurring
```http
POST /api/billing/recurring/:id/generate
Authorization: Bearer <token>
```

### Pause/Resume/Cancel
```http
POST /api/billing/recurring/:id/pause
POST /api/billing/recurring/:id/resume
POST /api/billing/recurring/:id/cancel
Authorization: Bearer <token>
```

---

## 📈 Reports Routes (`/api/billing/reports`)

### Profit & Loss Statement
```http
GET /api/billing/reports/profit-loss?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Balance Sheet
```http
GET /api/billing/reports/balance-sheet?asOnDate=2024-12-31
Authorization: Bearer <token>
```

### Ledger Report
```http
GET /api/billing/reports/ledger?type=customer&customerId=xxx&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```
**Types:** `customer`, `product`, `general`

### Sales Report
```http
GET /api/billing/reports/sales?groupBy=month&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```
**Group By:** `day`, `week`, `month`, `year`, `customer`, `product`

### Outstanding Report
```http
GET /api/billing/reports/outstanding?type=receivables
Authorization: Bearer <token>
```

---

## 🧾 GST Routes (`/api/billing/gst`)

### GSTR-1 Export
```http
GET /api/billing/gst/gstr1?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### GSTR-3B Export
```http
GET /api/billing/gst/gstr3b?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Export to CSV/JSON
```http
GET /api/billing/gst/export?type=gstr1&format=csv
Authorization: Bearer <token>
```

---

## 👨‍💼 Staff Routes (`/api/billing/staff`)

### Get All Staff
```http
GET /api/billing/staff
Authorization: Bearer <token>
```

### Invite Staff
```http
POST /api/billing/staff/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Staff Name",
  "phone": "+919876543210",
  "email": "staff@example.com",
  "role": "manager", // owner, admin, manager, accountant, sales, staff
  "permissions": {
    "invoices": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false,
      "share": true
    }
  }
}
```

### Update Permissions
```http
PUT /api/billing/staff/:id/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "permissions": { ... }
}
```

---

## 🎨 Template Routes (`/api/billing/templates`)

### Get All Templates
```http
GET /api/billing/templates
Authorization: Bearer <token>
```

### Get Default Template
```http
GET /api/billing/templates/default
Authorization: Bearer <token>
```

### Create Template
```http
POST /api/billing/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Modern Template",
  "description": "Modern invoice design",
  "design": {
    "layout": "modern",
    "primaryColor": "#2563eb",
    "secondaryColor": "#64748b",
    "fontFamily": "Arial, sans-serif",
    "showLogo": true,
    "showBusinessDetails": true
  },
  "isDefault": false
}
```

### Preview Template
```http
GET /api/billing/templates/:id/preview
Authorization: Bearer <token>
```

---

## 📤 Bulk Operations (`/api/billing/bulk`)

### Bulk Product Upload
```http
POST /api/billing/bulk/products/upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": [
    {
      "name": "Product 1",
      "sku": "SKU001",
      "price": 1000,
      "taxRate": 18,
      "hsn": "12345678"
    },
    {
      "name": "Product 2",
      "sku": "SKU002",
      "price": 2000,
      "taxRate": 18
    }
  ]
}
```

### Bulk Customer Upload
```http
POST /api/billing/bulk/customers/upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "customers": [
    {
      "name": "Customer 1",
      "phone": "+919876543210",
      "email": "customer1@example.com"
    }
  ]
}
```

### Export Products
```http
GET /api/billing/bulk/products/export?format=csv
Authorization: Bearer <token>
```

### Export Customers
```http
GET /api/billing/bulk/customers/export?format=json
Authorization: Bearer <token>
```

---

## 🏢 Business Routes (`/api/billing/businesses`)

### Get All Businesses
```http
GET /api/billing/businesses
Authorization: Bearer <token>
```

### Create Business/Branch
```http
POST /api/billing/businesses
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "New Branch",
  "businessType": "Retail",
  "gstin": "27ABCDE1234F1Z5",
  "currency": "INR",
  "isBranch": true,
  "branchCode": "BR001"
}
```

### Switch Business Context
```http
POST /api/billing/businesses/:id/switch
Authorization: Bearer <token>
```

---

## 🛒 Purchase Routes (`/api/billing/purchases`)

### Get All Purchases
```http
GET /api/billing/purchases?status=paid&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Create Purchase
```http
POST /api/billing/purchases
Authorization: Bearer <token>
Content-Type: application/json

{
  "supplierId": "supplier_id",
  "purchaseDate": "2024-01-15",
  "dueDate": "2024-01-22",
  "items": [
    {
      "name": "Raw Material",
      "quantity": 10,
      "price": 500,
      "taxRate": 18,
      "taxType": "GST"
    }
  ],
  "warehouseId": "warehouse_id"
}
```

---

## 📢 Marketing Routes (`/api/billing/campaigns`)

### Get All Campaigns
```http
GET /api/billing/campaigns?status=completed&type=sms
Authorization: Bearer <token>
```

### Create Campaign
```http
POST /api/billing/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Festival Sale",
  "type": "whatsapp", // sms, whatsapp, email
  "message": "Special discount for {name}! Get 20% off.",
  "recipients": {
    "type": "all" // all, selected, filtered
  },
  "scheduledAt": "2024-12-25T10:00:00Z"
}
```

### Send Campaign
```http
POST /api/billing/campaigns/:id/send
Authorization: Bearer <token>
```

---

## 🎁 Loyalty Routes (`/api/billing/loyalty`)

### Get Customer Loyalty
```http
GET /api/billing/loyalty/customer/:customerId
Authorization: Bearer <token>
```

### Earn Points
```http
POST /api/billing/loyalty/earn
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer_id",
  "invoiceId": "invoice_id",
  "amount": 1000,
  "points": 100
}
```

### Redeem Points
```http
POST /api/billing/loyalty/redeem
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer_id",
  "points": 500,
  "description": "Redeemed for discount"
}
```

---

## 📋 E-Invoice & E-Way Bill Routes

### Generate E-Invoice
```http
POST /api/billing/einvoice/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "invoiceId": "invoice_id"
}
```

### Generate E-Way Bill
```http
POST /api/billing/ewaybill/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "invoiceId": "invoice_id",
  "vehicleNumber": "MH01AB1234",
  "transporterName": "ABC Transport",
  "distance": 100,
  "transportMode": "1"
}
```

---

## 📊 Dashboard Stats

### Get Statistics
```http
GET /api/billing/stats?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalInvoices": 100,
    "totalCustomers": 50,
    "totalProducts": 200,
    "totalRevenue": 500000,
    "totalPending": 100000,
    "totalSales": 600000,
    "paidInvoices": 80,
    "pendingInvoices": 20
  }
}
```

---

## 🔒 Error Responses

All errors follow this format:
```json
{
  "message": "Error description"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📝 Notes

1. All dates should be in ISO format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`
2. Phone numbers should include country code: `+919876543210`
3. Currency codes: INR, USD, EUR, GBP, JPY, CNY, AUD, CAD, SGD, AED, SAR, QAR, KWD, BHD, OMR
4. Document types: `invoice`, `delivery_challan`, `proforma_invoice`, `quotation`, `estimate`
5. Tax types: `GST`, `IGST`, `None`
6. Roles: `owner`, `admin`, `manager`, `accountant`, `sales`, `staff`

---

## 🚀 Quick Start

1. Start backend: `cd backend && npm run dev`
2. Backend runs on: `http://localhost:5000`
3. Test endpoint: `GET http://localhost:5000/` should return "MyBillPro API is running 🚀"

