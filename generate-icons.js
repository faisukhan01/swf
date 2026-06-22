const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputIcon = path.join(__dirname, 'mobile-app', 'assets', 'icon.png');
const outputDir = path.join(__dirname, 'public', 'icons');

// Create a simple colored square as fallback
const createColoredIcon = async (size, outputPath) => {
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 16, g: 185, b: 129, alpha: 1 }
    }
  })
  .png()
  .toFile(outputPath);
};

// Generate icons
async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      console.log(`Generating ${size}x${size} icon...`);
      
      try {
        // Try to resize existing icon
        await sharp(inputIcon)
          .resize(size, size, { fit: 'contain', background: { r: 16, g: 185, b: 129, alpha: 1 } })
          .png()
          .toFile(outputPath);
      } catch (err) {
        // If input icon is too small or invalid, create a colored square
        console.log(`Creating fallback icon for ${size}x${size}`);
        await createColoredIcon(size, outputPath);
      }
    }
    
    // Copy 512 as favicon
    await sharp(path.join(outputDir, 'icon-192x192.png'))
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
      
    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
