const sharp = require('sharp');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'public', 'icons');

// Create a beautiful icon with gradient and SWF text
async function createIcon(size, outputPath) {
  const fontSize = Math.floor(size * 0.4);
  const strokeWidth = Math.max(2, Math.floor(size * 0.02));
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.01}" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background with gradient -->
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#grad)"/>
      
      <!-- Shopping bag icon -->
      <g transform="translate(${size * 0.5}, ${size * 0.32})" filter="url(#shadow)">
        <path d="M ${-size * 0.18} ${-size * 0.08} 
                 L ${-size * 0.22} ${size * 0.12} 
                 L ${size * 0.22} ${size * 0.12} 
                 L ${size * 0.18} ${-size * 0.08} 
                 Z" 
              fill="rgba(255,255,255,0.25)" 
              stroke="white" 
              stroke-width="${strokeWidth}"/>
        <path d="M ${-size * 0.12} ${-size * 0.08} 
                 Q ${-size * 0.12} ${-size * 0.16} 0 ${-size * 0.16} 
                 Q ${size * 0.12} ${-size * 0.16} ${size * 0.12} ${-size * 0.08}" 
              fill="none" 
              stroke="white" 
              stroke-width="${strokeWidth * 1.2}"/>
      </g>
      
      <!-- SWF Text -->
      <text x="50%" y="72%" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="900" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle"
            filter="url(#shadow)">SWF</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
}

async function generateIcons() {
  console.log('🎨 Creating beautiful app icons with SWF branding...\n');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    console.log(`✨ Generating ${size}x${size} icon...`);
    await createIcon(size, outputPath);
  }
  
  // Create favicon
  console.log('✨ Generating favicon...');
  await sharp(path.join(outputDir, 'icon-192x192.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon.ico'));
  
  console.log('\n✅ All icons created successfully!');
  console.log('📱 Beautiful gradient icons with SWF branding ready!');
}

generateIcons().catch(console.error);
