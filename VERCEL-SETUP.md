# Vercel Environment Variables Setup

## ⚠️ IMPORTANT: Authentication Won't Work Without This!

Your app uses environment variables for admin credentials. You MUST add these to Vercel for auth to work.

## 🔧 Steps to Fix Authentication on Vercel:

1. **Go to your Vercel project dashboard**:
   - Visit: https://vercel.com/
   - Select your `swf` project

2. **Go to Settings → Environment Variables**

3. **Add these environment variables**:

   ```
   ADMIN_EMAIL = admin@swf.com
   ADMIN_PASSWORD = admin123
   ```

   **IMPORTANT**: Change `admin123` to a secure password in production!

4. **Redeploy**:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## ✅ After Adding Environment Variables:

- **Sign Up** will work (stores users in browser localStorage)
- **Sign In** will work (verifies against localStorage)  
- **Admin Login** will work (`admin@swf.com` / `admin123`)

## 🎯 How It Works:

- Regular users → Stored in browser's localStorage (no database needed)
- Admin user → Credentials from environment variables
- Passwords → Hashed with bcrypt for security

## 🔐 Security Note:

The `.env` file is NOT pushed to GitHub (it's in `.gitignore`).
You must set environment variables directly in Vercel's dashboard.
