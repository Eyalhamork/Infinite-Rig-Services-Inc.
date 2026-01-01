const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const inputPath = path.join(__dirname, 'public', 'logo.png');
const outputDir = path.join(__dirname, 'public');

// Check if input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: logo.png not found at ${inputPath}`);
  console.log('Please ensure you have a logo.png file in your public folder');
  process.exit(1);
}

console.log('🎨 Generating PWA icons from logo.png...\n');

// Generate icons for each size
const generateIcons = async () => {
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated icon-${size}x${size}.png`);
    }

    // Generate favicon.ico (32x32)
    const faviconPath = path.join(outputDir, 'favicon.ico');
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ Generated favicon.ico');

    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('\n📱 Next steps:');
    console.log('1. Copy these files to your project\'s public folder');
    console.log('2. Build your Next.js app: npm run build');
    console.log('3. Deploy to your server');
    console.log('4. Test PWA install on mobile by visiting your site');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
};

generateIcons();
