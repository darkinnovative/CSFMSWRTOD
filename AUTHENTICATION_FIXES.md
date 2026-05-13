# Quotation Authentication - Troubleshooting Guide

## Problem
The quotation form was showing "Could not validate credentials" error when trying to create a new quotation.

## Root Causes Fixed

### 1. Backend Authentication Handler
- **Issue**: The `get_current_user()` function had minimal error logging, making it difficult to diagnose credential validation failures.
- **Fix**: Added detailed logging for each validation step:
  - Missing Authorization header
  - Invalid header format
  - Invalid Bearer scheme
  - Missing JWT claims
  - JWT validation errors
  - User not found in database

### 2. Frontend Token Handling
- **Issue**: No verification that token exists before making API calls.
- **Fix**: Added token existence check in the quotation submission handler with console logging.

### 3. Environment Configuration
- **Issue**: No `.env` file in backend - application was using default SECRET_KEY.
- **Fix**: Created `/backend/.env` with proper SECRET_KEY configuration.

### 4. Auth Endpoint Bug
- **Issue**: The `/auth/me` endpoint had incorrect implementation - trying to call `get_current_user()` as a regular function instead of using dependency injection.
- **Fix**: Corrected to properly use FastAPI's dependency injection pattern.

## How to Troubleshoot Authentication Issues

### Step 1: Verify Backend is Running
```bash
# Terminal 1
cd /home/dark/Desktop/eyes/backend
source .venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Test Authentication Debug Endpoint
Make a request with valid token:
```bash
# Get token from login first, then:
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8000/auth/debug/test-auth
```

You should see:
```json
{
  "status": "success",
  "message": "Authentication is working!",
  "user_id": 1,
  "user_email": "admin@darkinnovative.com",
  "user_company_id": 1
}
```

If you see "Could not validate credentials", check the backend terminal for detailed error messages like:
- `[AUTH ERROR] No authorization header provided`
- `[AUTH ERROR] Invalid authorization header format`
- `[AUTH ERROR] JWT validation failed`

### Step 3: Check Frontend Console
Open browser console (F12) and look for:
- `[API Client] Authorization header set for request to: /api/quotations`
- `[Quotation Create] Token exists, attempting to create quotation...`

If you see `[API Client] No token found in localStorage`, the user is not properly logged in.

### Step 4: Verify Token Storage
In browser console, run:
```javascript
console.log("Token:", localStorage.getItem("token"));
console.log("User:", localStorage.getItem("user"));
```

If either is empty/null, user needs to log in again.

## Testing the Fix

### 1. Login
- Go to `/login`
- Use credentials: 
  - Email: `admin@darkinnovative.com`
  - Password: `password`
- Verify token is stored: `localStorage.getItem("token")` in console

### 2. Navigate to Dashboard
- Go to `/dashboard`
- Click "Quotation" tab
- Click "New Quotation" button

### 3. Fill Form and Submit
- Fill all required fields
- Check console for debug messages
- Form should submit successfully

## Common Issues and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Could not validate credentials" | No Authorization header sent | Verify token in localStorage |
| "Could not validate credentials" | Invalid Bearer format | Check API client interceptor is working |
| "Could not validate credentials" | Token expired | Log out and log in again |
| "Could not validate credentials" | Wrong SECRET_KEY | Verify .env file has correct SECRET_KEY |
| "Could not validate credentials" | User not in database | Run setup_demo_user or create user via register |

## Files Modified

1. **Backend**
   - `/backend/app/auth.py` - Added detailed error logging and fixed imports
   - `/backend/app/routes/auth.py` - Fixed `/auth/me` endpoint and added debug endpoint
   - `/backend/.env` - Created environment configuration file

2. **Frontend**
   - `/frontend/lib/api.ts` - Added auth test method and improved logging
   - `/frontend/app/dashboard/page.tsx` - Added token verification before submission

## Next Steps

1. Restart backend server
2. Clear browser cache and localStorage if needed
3. Log out and log back in
4. Try creating a quotation
5. Check browser console for debug messages
6. If still failing, call `/auth/debug/test-auth` endpoint directly to verify token validation

## Security Notes

- The debug endpoint `/auth/debug/test-auth` should only be used during development
- Remove it in production or gate it behind DEBUG flag
- Ensure SECRET_KEY is properly set in production environment
- Store SECRET_KEY in secure environment variables, not in .env files
