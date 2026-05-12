#!/bin/bash

# Deployment script for IKF Outreach (Ubuntu - Monolith)
# Requires: Node.js 20+, PM2, npm

set -e

APP_ROOT="/var/www/apps/outreach"

echo "----------------------------------------"
echo "Deploying IKF Outreach..."
echo "----------------------------------------"

cd "$APP_ROOT"

# 1. Install dependencies
echo "Installing dependencies..."
npm install --production=false

# 2. Build
echo "Building Next.js app..."
npm run build

# 3. Copy static assets into standalone output
echo "Copying static assets..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 4. PM2 restart/start
echo "Restarting app via PM2..."
pm2 restart deploy/ecosystem.config.cjs --env production || \
pm2 start deploy/ecosystem.config.cjs --env production

pm2 save

echo "----------------------------------------"
echo "Deployment Complete!"
echo "----------------------------------------"
pm2 status
