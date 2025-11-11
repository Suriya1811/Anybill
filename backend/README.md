# MyBillPro Backend API

Complete billing and invoicing backend API with all features implemented.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Twilio account (optional, for SMS OTP)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/billapp
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
TWILIO_PHONE=+919876543210

# Frontend URL
FRONTEND_URL=http://localhost:5173

NODE_ENV=development
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── configs/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── permissionsMiddleware.js  # Role-based access
│   ├── models/                # 15 Mongoose models
│   │   ├── User.js
│   │   ├── Business.js
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Invoice.js
│   │   └── ... (10 more)
│   ├── routes/                # 15 route files
│   │   ├── authRoutes.js
│   │   ├── billingRoutes.js
│   │   └── ... (13 more)
│   └── server.js              # Express server
├── .env                       # Environment variables
└── package.json
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Main Routes
- `/api/auth` - Authentication (OTP, login, profile)
- `/api/billing` - All billing operations
  - `/invoices` - Invoice management
  - `/customers` - Customer management
  - `/products` - Product management
  - `/warehouses` - Warehouse management
  - `/inventory` - Inventory management
  - `/recurring` - Recurring invoices
  - `/reports` - Business reports
  - `/gst` - GST compliance
  - `/staff` - Staff management
  - `/templates` - Invoice templates
  - `/bulk` - Bulk operations
  - `/businesses` - Multi-business
  - `/suppliers` - Supplier management
  - `/purchases` - Purchase invoices
  - `/campaigns` - Marketing campaigns
  - `/loyalty` - Loyalty programs
  - `/einvoice` - E-Invoicing
  - `/ewaybill` - E-Way Bill

See `API_DOCUMENTATION.md` for complete API reference.

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test API
```bash
curl http://localhost:5000/
```

## 📚 Documentation

- **API Documentation**: `../API_DOCUMENTATION.md`
- **Quick Start Guide**: `../QUICK_START_GUIDE.md`
- **Feature Status**: `../FEATURE_IMPLEMENTATION_STATUS.md`

## 🔒 Security

- JWT token-based authentication
- Role-based access control
- Input validation
- Error handling
- CORS configuration

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas
4. Set up Twilio for SMS
5. Configure CORS for your domain
6. Use process manager (PM2, etc.)

## 📝 Features

✅ Complete billing & invoicing
✅ Inventory management
✅ GST compliance
✅ Accounting reports
✅ Multi-user & multi-business
✅ Marketing & CRM
✅ Loyalty programs
✅ Bulk operations
✅ And much more!

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify `MONGO_URI` in `.env`
- Check network access for Atlas

### OTP Not Received
- Check Twilio credentials
- Verify phone number format (+91XXXXXXXXXX)
- Check backend console for errors

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 5000

## 📄 License

Private - All rights reserved
