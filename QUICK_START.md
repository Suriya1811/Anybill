# MyBillPro - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/billapp
# JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
# PORT=5000

npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📱 First Time Setup

1. **Register:** Go to `/signup` and enter your phone number
2. **Verify OTP:** Check backend console for OTP (if Twilio not configured)
3. **Complete Profile:** Fill in business details
4. **Dashboard:** Start creating customers, products, and invoices!

## ✅ Features Implemented

- ✅ OTP Authentication (Phone number)
- ✅ JWT Authentication
- ✅ Phone Number Uniqueness (One phone = One user)
- ✅ Profile Completion Flow
- ✅ Dashboard with Statistics
- ✅ Invoice Management (Create, View, Edit)
- ✅ Customer Management
- ✅ Product Management
- ✅ GST Compliance (GST/IGST)
- ✅ Tax Calculations (CGST, SGST, IGST)
- ✅ HSN/SAC Code Support
- ✅ Payment Tracking
- ✅ Reports & Analytics
- ✅ Role-Based Access

## 🎯 Key Points

1. **Phone Number Uniqueness:** Each phone number can only be used once
2. **OTP Flow:** OTP is logged to console if Twilio not configured
3. **Profile Completion:** Required after first OTP verification
4. **JWT Tokens:** 7-day expiration, auto-refresh on API calls
5. **Data Isolation:** All data is user-specific (userId in queries)

## 🐛 Troubleshooting

**OTP Not Coming?**
- Check backend console
- Verify MongoDB is running
- Check backend is on port 5000

**Cannot Create Invoice?**
- Ensure customer exists
- Ensure products exist
- Check browser console

**Database Errors?**
- Verify MongoDB connection
- Check .env file
- Verify phone number format

## 📚 Full Documentation

See `SETUP_GUIDE.md` for complete documentation.

---

**Ready to bill! 🎉**

