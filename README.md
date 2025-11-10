# MyBillPro - Billing Application

A modern, full-stack billing application with OTP-based authentication, built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Features

- **OTP Authentication**: Secure login/signup with mobile number and OTP verification
- **JWT Authentication**: Token-based authentication for protected routes
- **Modern UI**: Beautiful, responsive design with full-screen layout
- **Dashboard**: User dashboard with role-based access
- **MongoDB**: Database for user and OTP management
- **Twilio Integration**: SMS OTP delivery

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Twilio Account** (for OTP SMS - optional for development)

## 🛠️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the `backend` directory:**
   ```env
   MONGO_URI=mongodb://localhost:27017/billapp
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=5000
   ```

   > **Note:** For development, you can use a mock OTP service or skip Twilio setup. The OTP will be logged to console.

4. **Start MongoDB:**
   - If using local MongoDB, make sure it's running
   - Or use MongoDB Atlas and update `MONGO_URI` in `.env`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the `frontend` directory (optional):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Option 2: Run Backend in Production Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📱 Usage

1. **Start the backend server** (Terminal 1)
2. **Start the frontend server** (Terminal 2)
3. **Open your browser** and navigate to `http://localhost:5173`
4. **Sign Up/Login:**
   - Click "Get Started" or "Login"
   - Enter your phone number (with country code, e.g., +91 9876543210)
   - You'll receive an OTP (check console if Twilio is not configured)
   - Enter the OTP to verify
   - You'll be redirected to the dashboard

## 🔧 Available Scripts

### Backend Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Frontend Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
billapp/
├── backend/
│   ├── src/
│   │   ├── configs/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT verification
│   │   ├── models/
│   │   │   ├── User.js        # User model
│   │   │   └── OTP.js         # OTP model
│   │   ├── routes/
│   │   │   └── authRoutes.js  # Authentication routes
│   │   └── server.js          # Express server
│   ├── package.json
│   └── .env                   # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── styles/            # CSS files
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── package.json
    └── vite.config.js
```

## 🔐 Authentication Flow

1. User enters phone number on Login/Signup page
2. Backend generates 6-digit OTP and sends via Twilio
3. OTP is hashed and stored in MongoDB with 5-minute expiration
4. User enters OTP on verification page
5. Backend verifies OTP and issues JWT token
6. Frontend stores token and redirects to dashboard
7. Protected routes check for valid JWT token

## 🐛 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Make sure MongoDB is running or check your `MONGO_URI`
- **Port Already in Use**: Change `PORT` in `.env` or kill the process using port 5000
- **Twilio Errors**: For development, you can modify the code to log OTP to console instead

### Frontend Issues

- **CORS Errors**: Make sure backend CORS is enabled (already configured)
- **API Connection Error**: Verify backend is running on port 5000
- **Build Errors**: Run `npm install` again in the frontend directory

## 📝 Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `PORT` - Server port (default: 5000)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## 🎨 Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Axios
- Vite
- CSS3 (Custom styling)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- Bcrypt
- Twilio

## 📄 License

ISC

## 👨‍💻 Development

For development, you can:
- Use `npm run dev` for both frontend and backend (with hot reload)
- Check browser console and terminal for logs
- OTP will be logged to backend console if Twilio is not configured

---

**Happy Coding! 🚀**

