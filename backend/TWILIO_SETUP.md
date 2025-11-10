# Twilio Setup Instructions

## ✅ Your Twilio Credentials

Based on your provided credentials, you have:
- ✅ Twilio Account SID
- ✅ Twilio Auth Token  
- ✅ Twilio Verify Service SID (Recommended - Use this!)
- ✅ Twilio Phone Number

## 📝 Environment Variables Setup

Create or update `backend/.env` file with these exact values:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/billapp

# JWT Secret (Change this to a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this

# Server
PORT=5000
NODE_ENV=development

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACb1c43c0746e3cfb80dfe6ffea4e7659c
TWILIO_AUTH_TOKEN=2a163c9d1167c44793e410be83a9c780
TWILIO_VERIFY_SERVICE_SID=VA46295c24f2523637ff43d540d778e900

# Optional: For direct SMS (not needed if using Verify API)
TWILIO_PHONE=+919342165255
```

## 🔍 Important Notes

1. **Twilio Verify API (Recommended):**
   - Uses `TWILIO_VERIFY_SERVICE_SID`
   - More secure and reliable
   - Twilio handles OTP generation
   - Better delivery rates

2. **Phone Number Format:**
   - Always include country code with `+`
   - Example: `+919342165255` (not `09342165255`)

3. **Verification:**
   - After updating `.env`, restart the backend server
   - Check console for: `✅ Twilio Verify API configured`
   - Test by sending OTP

## 🚀 Testing

1. Start backend: `npm run dev`
2. Check console for Twilio configuration message
3. Send OTP from frontend
4. Check phone for OTP message
5. If error, check console for detailed error messages

## 🐛 Troubleshooting

**Error: "Unable to create record"**
- Check Twilio Account SID and Auth Token
- Verify account is active in Twilio console

**Error: "Invalid phone number"**
- Ensure phone number includes country code (`+91`)
- Remove any spaces or special characters

**OTP not received:**
- Check Twilio console for message logs
- Verify phone number is correct
- Check account balance in Twilio
- Verify service is active

**Error: "Service not found"**
- Verify `TWILIO_VERIFY_SERVICE_SID` is correct
- Check service is active in Twilio Verify console

## 📞 Support

If OTP still doesn't work:
1. Check backend console for detailed errors
2. Verify credentials in Twilio console
3. Test phone number format
4. Check Twilio account status and balance

