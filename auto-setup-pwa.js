#!/usr/bin/env node

/**
 * PWA Local Testing - Automated Setup
 * Starts server, ngrok, and displays QR code
 */

const { spawn, exec } = require('child_process');
const http = require('http');

console.log('\n🚀 Starting PWA Local Testing Setup...\n');

// Step 1: Build the app
console.log('📦 Building app...');
const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

build.on('close', (code) => {
  if (code !== 0) {
    console.error('\n❌ Build failed!');
    process.exit(1);
  }

  console.log('\n✅ Build successful!');
  
  // Step 2: Start Next.js server
  console.log('🚀 Starting Next.js server...\n');
  const server = spawn('npm', ['start'], { 
    stdio: 'pipe',
    detached: false 
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  // Wait for server to be ready
  setTimeout(() => {
    checkServerAndStartNgrok();
  }, 5000);

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...');
    server.kill();
    process.exit();
  });
});

function checkServerAndStartNgrok() {
  http.get('http://localhost:3000', (res) => {
    console.log('✅ Server is ready!\n');
    startNgrok();
  }).on('error', (err) => {
    console.log('⏳ Waiting for server...');
    setTimeout(checkServerAndStartNgrok, 2000);
  });
}

function startNgrok() {
  console.log('🌐 Starting ngrok tunnel...\n');
  
  // Check if ngrok is installed
  exec('which ngrok || where ngrok', (error) => {
    if (error) {
      console.log('❌ ngrok not found!');
      console.log('\n📥 Please install ngrok:');
      console.log('   Download: https://ngrok.com/download');
      console.log('   Or run: brew install ngrok (Mac)');
      console.log('   Or run: choco install ngrok (Windows)');
      process.exit(1);
    }

    const ngrok = spawn('ngrok', ['http', '3000'], { 
      stdio: 'pipe' 
    });

    // Wait a bit for ngrok to start
    setTimeout(() => {
      // Get ngrok URL
      exec('curl -s http://localhost:4040/api/tunnels', (error, stdout) => {
        if (error) {
          console.log('⏳ Waiting for ngrok...');
          setTimeout(() => getNgrokUrl(), 2000);
          return;
        }

        try {
          const data = JSON.parse(stdout);
          const tunnel = data.tunnels.find(t => t.proto === 'https');
          if (tunnel) {
            const url = tunnel.public_url;
            displaySuccess(url);
          }
        } catch (e) {
          console.log('⏳ Waiting for ngrok to initialize...');
          setTimeout(() => getNgrokUrl(), 2000);
        }
      });
    }, 3000);
  });
}

function getNgrokUrl() {
  exec('curl -s http://localhost:4040/api/tunnels', (error, stdout) => {
    if (!error) {
      try {
        const data = JSON.parse(stdout);
        const tunnel = data.tunnels.find(t => t.proto === 'https');
        if (tunnel) {
          displaySuccess(tunnel.public_url);
        }
      } catch (e) {}
    }
  });
}

function displaySuccess(url) {
  console.log('\n' + '='.repeat(60));
  console.log('✅ PWA READY FOR TESTING!');
  console.log('='.repeat(60));
  console.log('\n📱 SHARE THIS URL WITH YOUR BOSS:\n');
  console.log(`   ${url}`);
  console.log('\n📋 INSTRUCTIONS:\n');
  console.log('   1. Send the URL above to your boss\'s phone');
  console.log('   2. They open it in their browser');
  console.log('   3. Android: Menu (⋮) → "Install app"');
  console.log('   4. iOS: Share (□↑) → "Add to Home Screen"');
  console.log('\n💡 TIP: Generate QR code at: https://qr.io');
  console.log('   Paste the URL and show the QR code to scan');
  console.log('\n🛑 Press Ctrl+C to stop the server');
  console.log('='.repeat(60) + '\n');

  // Try to generate QR code if qrcode package is available
  try {
    const qrcode = require('qrcode-terminal');
    console.log('📱 QR CODE (scan with phone):\n');
    qrcode.generate(url, { small: true });
    console.log('\n');
  } catch (e) {
    // qrcode-terminal not installed, skip
  }
}
