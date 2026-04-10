# Deployment Guide: IKF Outreach

This document provides instructions for the support team to host the **IKF Outreach** application on a production server.

## Prerequisites
- Node.js 18+ (Node 20+ recommended)
- PostgreSQL Database (Supabase recommended)
- Environment Variables configured

## 1. Environment Configuration
Copy `.env.example` to `.env` and fill in the required values:

- **DATABASE_URL**: Your PostgreSQL connection string.
- **NEXT_PUBLIC_SUPABASE_URL** & **NEXT_PUBLIC_SUPABASE_ANON_KEY**: From your Supabase project settings.
- **SUPABASE_SERVICE_ROLE_KEY**: Required for administrative tasks.
- **STRATEGIC_SECRET**: A random string used for sensitive data encryption.
- **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: From Google Cloud Console (for Gmail integration).
- **NEXT_PUBLIC_BASE_PATH**: Set this if IIS hosts the app under a virtual directory instead of the site root, for example `/ikf-outreach`.

## 2. Standard Installation & Build
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply Database Schema
npx prisma db push

# Build for Production
npm run build

# Start the Application
npm start
```

## 3. Worker Service (Campaign Processing)
The application uses a background worker for campaign generation and delivery.
```bash
npm run worker
```

## 4. Operational Troubleshooting
- **Prisma Issues**: If you encounter file-locking issues during `npx prisma generate` on Windows servers, ensure all Node processes are closed before regenerating.
- **Connection Errors**: Ensure your server's IP is allowlisted in your database (Supabase) settings.
- **IIS Virtual Directories**: If the UI loads from a subpath and `/api/*` calls return 404 HTML pages, set `NEXT_PUBLIC_BASE_PATH` to that subpath and rebuild so links, redirects, and API requests resolve correctly.

---
The system is designed for high-availability client communication management.
