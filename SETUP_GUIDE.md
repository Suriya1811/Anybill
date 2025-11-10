# MyBillPro - Complete Setup Guide

## 🚀 Industry-Level Billing Software

MyBillPro is a comprehensive, full-stack billing software with OTP authentication, JWT-based security, and complete billing management features.

## 📋 Features

### Authentication & Security
- ✅ OTP-based authentication via mobile number
- ✅ JWT token-based authentication
- ✅ Phone number uniqueness (one phone = one user)
- ✅ Profile completion flow
- ✅ Protected routes
- ✅ Role-based access control

### Billing Features
- ✅ Invoice creation and management
- ✅ Customer management
- ✅ Product/Inventory management
- ✅ GST compliance (GST/IGST)
- ✅ HSN/SAC code support
- ✅ Tax calculations (CGST, SGST, IGST)
- ✅ Payment tracking
- ✅ Reports and analytics
- ✅ Dashboard with statistics

### Business Features
- ✅ Business profile management
- ✅ Multiple business types support
- ✅ Address management
- ✅ Credit limit tracking
- ✅ Invoice numbering system
- ✅ Discount support (fixed/percentage)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Twilio Account (optional, for SMS OTP)

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `backend` directory:**
   ```env
   MONGO_URI=mongodb://localhost:27017/billapp
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this_in_production
   PORT=5000
   NODE_ENV=development

   # Optional: Twilio Configuration (for SMS OTP)
   # If not configured, OTP will be logged to console
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Start MongoDB:**
   - Local: Make sure MongoDB is running
   - Atlas: Update `MONGO_URI` with your connection string

5. **Run backend:**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `frontend` directory (optional):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run frontend:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 🔐 Authentication Flow

1. **User Registration/Login:**
   - User enters phone number
   - OTP is sent (via Twilio or logged to console)
   - User enters OTP
   - If new user → Profile completion page
   - If existing user → Dashboard

2. **Profile Completion:**
   - User enters:
     - Full Name
     - Email (optional)
     - Business Name
     - Business Type
     - GSTIN (optional)
     - Address
   - Profile is saved
   - User is redirected to dashboard

3. **Dashboard Access:**
   - JWT token stored in localStorage
   - All API calls include token in headers
   - Protected routes check token validity

## 📱 Phone Number Uniqueness

- **One phone number = One user account**
- Phone numbers are normalized (e.g., `+91` prefix)
- Duplicate phone numbers are prevented at database level
- User model has unique index on phone field

## 🎯 Usage Guide

### Creating an Invoice

1. Go to **Invoices** tab
2. Click **Create Invoice**
3. Select customer
4. Add items (or select from products)
5. Set invoice date and due date
6. Add discount (optional)
7. Add notes (optional)
8. Click **Create Invoice**

### Managing Customers

1. Go to **Customers** tab
2. Click **Add Customer**
3. Fill in customer details:
   - Name (required)
   - Phone (required)
   - Email (optional)
   - GSTIN (optional)
   - Address
   - Credit Limit
4. Click **Create Customer**

### Managing Products

1. Go to **Products** tab
2. Click **Add Product**
3. Fill in product details:
   - Name (required)
   - Price (required)
   - Tax Rate
   - Tax Type (GST/IGST)
   - HSN/SAC Code
   - Stock (optional)
4. Click **Create Product**

### Viewing Reports

1. Go to **Reports** tab
2. Select date range
3. View statistics:
   - Total Sales
   - Total Revenue
   - Pending Amount
   - Invoice counts
4. View recent invoices

## 🏗️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── configs/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Business.js        # Business model
│   │   ├── Customer.js        # Customer model
│   │   ├── Product.js         # Product model
│   │   ├── Invoice.js         # Invoice model
│   │   └── OTP.js             # OTP model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── billingRoutes.js   # Billing routes
│   └── server.js              # Express server
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── OtpVerify.jsx
│   │   ├── CompleteProfile.jsx
│   │   ├── Dashboard.jsx
│   │   └── ...
│   ├── styles/
│   │   ├── dashboard.css
│   │   ├── auth.css
│   │   └── ...
│   ├── utils/
│   │   └── api.js             # Axios instance with interceptors
│   └── App.jsx
└── package.json
```

## 🔒 Security Features

1. **JWT Authentication:**
   - Tokens expire after 7 days
   - Temporary tokens for profile completion (10 minutes)
   - Token verification middleware

2. **Phone Number Security:**
   - Unique constraint on phone numbers
   - Normalized phone numbers
   - OTP expiration (5 minutes)

3. **Data Security:**
   - User data isolation (userId in all queries)
   - Input validation
   - Error handling

## 📊 Database Models

### User Model
- Phone (unique, indexed)
- Name, Email
- Business Name, Business Type
- GSTIN
- Address
- Role (admin, user, manager)
- Profile completion status

### Customer Model
- User ID (foreign key)
- Name, Phone, Email
- GSTIN
- Address
- Balance, Credit Limit

### Product Model
- User ID (foreign key)
- Name, SKU
- Price, Cost
- Tax Rate, Tax Type
- HSN/SAC Code
- Stock information

### Invoice Model
- User ID (foreign key)
- Invoice Number (unique)
- Customer ID (foreign key)
- Items array
- Tax details (CGST, SGST, IGST)
- Total, Paid, Balance
- Status (draft, sent, paid, partial, overdue, cancelled)

## 🚨 Troubleshooting

### OTP Not Coming
- Check backend console for OTP (if Twilio not configured)
- Verify backend is running on port 5000
- Check MongoDB connection
- Verify phone number format

### Cannot Create Invoice
- Ensure customer exists
- Ensure products exist (if using product selection)
- Check browser console for errors
- Verify JWT token is valid

### Database Errors
- Verify MongoDB is running
- Check `.env` file for correct `MONGO_URI`
- Check for duplicate phone numbers
- Verify database indexes

## 📝 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/complete-profile` - Complete profile
- `GET /api/auth/me` - Get current user

### Billing
- `GET /api/billing/customers` - Get all customers
- `POST /api/billing/customers` - Create customer
- `GET /api/billing/products` - Get all products
- `POST /api/billing/products` - Create product
- `GET /api/billing/invoices` - Get all invoices
- `POST /api/billing/invoices` - Create invoice
- `GET /api/billing/stats` - Get dashboard statistics

## 🎨 Features Overview

### Dashboard
- Statistics cards
- Quick actions
- Recent activity

### Invoices
- Create invoices
- View all invoices
- Invoice status tracking
- Payment tracking

### Customers
- Customer management
- Customer balance tracking
- Credit limit management

### Products
- Product management
- Inventory tracking
- Tax configuration
- HSN/SAC codes

### Reports
- Sales reports
- Revenue reports
- Pending amounts
- Invoice analytics

### Settings
- Profile management
- Business information
- Address management

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure Twilio for SMS
4. Use MongoDB Atlas
5. Set up environment variables
6. Use process manager (PM2)

### Frontend
1. Build for production: `npm run build`
2. Serve static files
3. Configure API URL
4. Enable HTTPS
5. Set up CDN (optional)

## 📞 Support

For issues or questions:
1. Check console logs
2. Verify environment variables
3. Check MongoDB connection
4. Verify API endpoints
5. Check browser network tab

## 🎯 Next Steps

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Open Browser:** `http://localhost:5173`
4. **Register:** Enter phone number
5. **Complete Profile:** Fill in business details
6. **Start Billing:** Create customers, products, and invoices

---

**Happy Billing! 🚀**

