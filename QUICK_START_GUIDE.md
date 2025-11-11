# MyBillPro - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Twilio Account (optional, for SMS OTP)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (if needed)
cd ../frontend
npm install
```

### Step 2: Configure Environment

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/billapp
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/billapp

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Twilio (Optional - for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
TWILIO_PHONE=+919876543210
TWILIO_PHONE_NUMBER=+919876543210

# Frontend URL (for invoice sharing)
FRONTEND_URL=http://localhost:5173

NODE_ENV=development
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows (if installed as service, starts automatically)
# Or manually:
mongod
```

**MongoDB Atlas:**
- No local setup needed, just use the connection string

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
✅ Twilio Verify API configured (or ⚠️ Twilio not configured)
🚀 Server running on port 5000
```

### Step 5: Test API

Open browser: `http://localhost:5000`

Or test with curl:
```bash
curl http://localhost:5000
# Should return: MyBillPro API is running 🚀
```

## 📱 First Steps

### 1. Create Account
- Use the frontend or API to send OTP
- Verify OTP
- Complete profile

### 2. Create Your First Customer
```bash
POST /api/billing/customers
{
  "name": "Test Customer",
  "phone": "+919876543210",
  "email": "customer@example.com"
}
```

### 3. Add Products
```bash
POST /api/billing/products
{
  "name": "Test Product",
  "price": 1000,
  "taxRate": 18,
  "taxType": "GST",
  "hsn": "12345678"
}
```

### 4. Create Invoice
```bash
POST /api/billing/invoices
{
  "customerId": "customer_id",
  "documentType": "invoice",
  "items": [
    {
      "name": "Test Product",
      "quantity": 2,
      "price": 1000,
      "taxRate": 18,
      "taxType": "GST"
    }
  ]
}
```

## 🎯 Common Operations

### Create Warehouse
```bash
POST /api/billing/warehouses
{
  "name": "Main Warehouse",
  "code": "WH001",
  "isDefault": true
}
```

### Add Inventory
```bash
POST /api/billing/inventory
{
  "productId": "product_id",
  "warehouseId": "warehouse_id",
  "quantity": 100
}
```

### Create Recurring Invoice
```bash
POST /api/billing/recurring
{
  "name": "Monthly Service",
  "customerId": "customer_id",
  "template": {
    "items": [{"name": "Service", "quantity": 1, "price": 1000}]
  },
  "frequency": "monthly",
  "autoSend": true
}
```

### Generate Reports
```bash
# P&L Statement
GET /api/billing/reports/profit-loss?startDate=2024-01-01&endDate=2024-12-31

# Sales Report
GET /api/billing/reports/sales?groupBy=month

# Outstanding Receivables
GET /api/billing/reports/outstanding?type=receivables
```

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

### OTP not received
- Check Twilio credentials in `.env`
- Verify phone number format (+91XXXXXXXXXX)
- Check backend console for error messages
- OTP will be logged to console if Twilio not configured

### Database connection error
- Verify MongoDB is running
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas, check network access settings

## 📚 Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Feature Status**: See `FEATURE_IMPLEMENTATION_STATUS.md`
- **Complete Features**: See `COMPLETE_FEATURE_LIST.md`

## 🎉 You're Ready!

The backend is fully functional with all features implemented. Start building your frontend or test the APIs using Postman/curl!

