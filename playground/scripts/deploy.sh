#!/bin/bash

# CDN Deployment Script for Directix Playground
# Supports: GitHub Pages, Vercel, Netlify

set -e

DEPLOY_TARGET=${1:-"github-pages"}
BUILD_DIR="dist"

echo "🚀 Deploying Directix Playground to $DEPLOY_TARGET..."

# Build playground
echo "📦 Building Playground..."
cd "$(dirname "$0")/.."

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  pnpm install
fi

# Build
echo "🔨 Building..."
pnpm build

# Check build output
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build failed: $BUILD_DIR directory not found"
  exit 1
fi

# Deployment targets
case $DEPLOY_TARGET in
  github-pages)
    echo "🌐 Deploying to GitHub Pages..."

    # Create .nojekyll file for GitHub Pages
    touch $BUILD_DIR/.nojekyll

    # Create CNAME if needed
    if [ -n "$CUSTOM_DOMAIN" ]; then
      echo "$CUSTOM_DOMAIN" > $BUILD_DIR/CNAME
      echo "✅ Custom domain configured: $CUSTOM_DOMAIN"
    fi

    # Deploy using gh-pages (if available)
    if command -v gh-pages &> /dev/null; then
      gh-pages -d $BUILD_DIR --message "Deploy Playground"
      echo "✅ Deployed to GitHub Pages"
    else
      echo "⚠️  gh-pages not found. Manual deployment required."
      echo "   Run: npx gh-pages -d $BUILD_DIR"
    fi
    ;;

  vercel)
    echo "▲ Deploying to Vercel..."

    if command -v vercel &> /dev/null; then
      vercel --prod
      echo "✅ Deployed to Vercel"
    else
      echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    fi
    ;;

  netlify)
    echo "🌐 Deploying to Netlify..."

    if command -v netlify &> /dev/null; then
      netlify deploy --prod --dir=$BUILD_DIR
      echo "✅ Deployed to Netlify"
    else
      echo "⚠️  Netlify CLI not found. Install with: npm i -g netlify-cli"
    fi
    ;;

  s3)
    echo "🪣 Deploying to S3..."

    if [ -z "$S3_BUCKET" ]; then
      echo "❌ S3_BUCKET environment variable not set"
      exit 1
    fi

    aws s3 sync $BUILD_DIR s3://$S3_BUCKET --delete
    echo "✅ Deployed to S3: s3://$S3_BUCKET"
    ;;

  local)
    echo "📁 Local deployment..."

    DEPLOY_PATH="../docs/public/playground"
    mkdir -p $DEPLOY_PATH
    cp -r $BUILD_DIR/* $DEPLOY_PATH/
    echo "✅ Deployed to: $DEPLOY_PATH"
    ;;

  *)
    echo "❌ Unknown deployment target: $DEPLOY_TARGET"
    echo "   Supported targets: github-pages, vercel, netlify, s3, local"
    exit 1
    ;;
esac

echo "✨ Deployment complete!"
