import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join } from 'path';

async function uploadMedia() {
  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set.');
    console.log('\n📝 To get your token:');
    console.log('1. Go to https://vercel.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings → Environment Variables');
    console.log('4. Add BLOB_READ_WRITE_TOKEN (or get it from Vercel CLI: vercel env pull)');
    process.exit(1);
  }

  const videoPath = join(process.cwd(), 'public/media/Video.mp4');
  const audioPath = join(process.cwd(), 'public/media/virtual-reality-audio.m4a');

  console.log('📤 Uploading media files to Vercel Blob...\n');

  try {
    // Upload video
    console.log('📹 Uploading Video.mp4...');
    const videoBlob = await put('media/Video.mp4', readFileSync(videoPath), {
      access: 'public',
      addRandomSuffix: false,
    });
    console.log('✅ Video uploaded:', videoBlob.url);

    // Upload audio
    console.log('🎵 Uploading virtual-reality-audio.m4a...');
    const audioBlob = await put('media/virtual-reality-audio.m4a', readFileSync(audioPath), {
      access: 'public',
      addRandomSuffix: false,
    });
    console.log('✅ Audio uploaded:', audioBlob.url);

    console.log('\n✨ Upload complete!\n');
    console.log('📋 Add these to your Vercel environment variables:');
    console.log(`VITE_VIDEO_URL=${videoBlob.url}`);
    console.log(`VITE_AUDIO_URL=${audioBlob.url}`);
    console.log('\n💡 Or add them to your .env file for local development.');

    return { videoUrl: videoBlob.url, audioUrl: audioBlob.url };
  } catch (error) {
    console.error('❌ Error uploading files:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

uploadMedia();
