# Vercel Blob Storage Setup Guide

This guide explains how to upload media files to Vercel Blob Storage and configure the application to use them.

## Why Vercel Blob?

Vercel Blob Storage is ideal for hosting large media files (like videos) that exceed GitHub's 100MB file size limit. It provides:
- Fast CDN delivery
- No file size limits
- Easy integration with Vercel projects
- Public URLs for media files

## Step 1: Get Your Vercel Blob Token

1. **Option A: Using Vercel CLI (Recommended)**
   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your project
   vercel link
   
   # Pull environment variables (includes BLOB_READ_WRITE_TOKEN)
   vercel env pull .env.local
   ```

2. **Option B: From Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to **Settings** → **Storage** → **Blob**
   - Create a new Blob store if needed
   - Copy the `BLOB_READ_WRITE_TOKEN` from environment variables

## Step 2: Set Environment Variable

Add the token to your environment:

```bash
# For local development, add to .env.local
export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
```

Or add it to Vercel Dashboard:
- Go to **Settings** → **Environment Variables**
- Add `BLOB_READ_WRITE_TOKEN` with your token value

## Step 3: Upload Media Files

Run the upload script:

```bash
npm run upload-media
```

This will:
1. Upload `Video.mp4` to Vercel Blob
2. Upload `virtual-reality-audio.m4a` to Vercel Blob
3. Display the URLs for both files

## Step 4: Configure Environment Variables

After uploading, you'll get URLs like:
```
https://[hash].public.blob.vercel-storage.com/media/Video.mp4
https://[hash].public.blob.vercel-storage.com/media/virtual-reality-audio.m4a
```

Add these to your environment variables:

### In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `VITE_VIDEO_URL` = `https://[hash].public.blob.vercel-storage.com/media/Video.mp4`
   - `VITE_AUDIO_URL` = `https://[hash].public.blob.vercel-storage.com/media/virtual-reality-audio.m4a`
3. Make sure to add them for **Production**, **Preview**, and **Development** environments

### For Local Development:
Create or update `.env.local`:
```env
VITE_VIDEO_URL=https://[hash].public.blob.vercel-storage.com/media/Video.mp4
VITE_AUDIO_URL=https://[hash].public.blob.vercel-storage.com/media/virtual-reality-audio.m4a
```

## Step 5: Redeploy

After adding environment variables:
1. Vercel will automatically redeploy
2. Or trigger a manual redeploy from the dashboard

## How It Works

The application uses environment variables with fallback to local paths:

```typescript
// src/data/mediaContent.ts
const VIDEO_URL = import.meta.env.VITE_VIDEO_URL || '/media/Video.mp4'
const AUDIO_URL = import.meta.env.VITE_AUDIO_URL || '/media/virtual-reality-audio.m4a'
```

- **Production (Vercel)**: Uses Vercel Blob URLs from environment variables
- **Local Development**: Falls back to local `/media/` paths if env vars not set

## Troubleshooting

### Error: BLOB_READ_WRITE_TOKEN not set
- Make sure you've set the token in your environment
- For local: Add to `.env.local` or export in terminal
- For Vercel: Add in Dashboard → Settings → Environment Variables

### Files not loading in production
- Verify environment variables are set in Vercel Dashboard
- Check that URLs are correct (no typos)
- Ensure environment variables are added for the correct environment (Production/Preview/Development)

### Upload script fails
- Check that files exist in `public/media/`
- Verify BLOB_READ_WRITE_TOKEN is correct
- Make sure you have internet connection

## Alternative: Manual Upload

If the script doesn't work, you can upload files manually:

1. Go to Vercel Dashboard → Storage → Blob
2. Upload files manually
3. Copy the public URLs
4. Add them as environment variables as described above
