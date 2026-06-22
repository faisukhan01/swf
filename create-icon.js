const sharp = require('sharp');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'public', 'icons');

// Create a stunning, modern icon with beautiful design
async function createIcon(size, outputPath) {
  const fontSize = Math.floor(size * 0.35);
  const letterSpacing = size * 0.015;
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Main gradient background -->
        <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#34d399;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        
        <!-- Shine effect -->
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.4);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" />
        </linearGradient>
        
        <!-- Text shadow -->
        <filter id="textShadow">
          <feDropShadow dx="0" dy="${size * 0.015}" stdDeviation="${size * 0.01}" flood-color="#000" flood-opacity="0.5"/>
        </filter>
        
        <!-- Glow effect -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="${size * 0.02}" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Main background with rounded corners -->
      <rect width="${size}" height="${size}" rx="${size * 0.225}" fill="url(#mainGrad)"/>
      
      <!-- Shine overlay on top -->
      <rect width="${size * 0.6}" height="${size * 0.6}" x="0" y="0" rx="${size * 0.225}" fill="url(#shine)" opacity="0.3"/>
      
      <!-- Decorative shopping bag -->
      <g transform="translate(${size * 0.5}, ${size * 0.35})" filter="url(#glow)">
        <!-- Bag body -->
        <rect x="${-size * 0.15}" y="${-size * 0.08}" 
              width="${size * 0.3}" height="${size * 0.2}" 
              rx="${size * 0.02}"
              fill="rgba(255,255,255,0.95)" 
              stroke="rgba(255,255,255,0.3)" 
              stroke-width="${size * 0.008}"/>
        
        <!-- Bag handle -->
        <path d="M ${-size * 0.08} ${-size * 0.08} 
                 Q ${-size * 0.08} ${-size * 0.14} 0 ${-size * 0.14} 
                 Q ${size * 0.08} ${-size * 0.14} ${size * 0.08} ${-size * 0.08}" 
              fill="none" 
              stroke="rgba(255,255,255,0.95)" 
              stroke-width="${size * 0.012}"
              stroke-linecap="round"/>
        
        <!-- Sparkle 1 -->
        <circle cx="${size * 0.18}" cy="${-size * 0.15}" r="${size * 0.015}" fill="white" opacity="0.8"/>
        <circle cx="${-size * 0.18}" cy="${-size * 0.05}" r="${size * 0.012}" fill="white" opacity="0.6"/>
      </g>
      
      <!-- SWF Text with modern styling -->
      <text x="50%" y="${size * 0.72}" 
            font-family="'SF Pro Display', 'Segoe UI', Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="900" 
            letter-spacing="${letterSpacing}"
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle"
            filter="url(#textShadow)">SWF</text>
      
      <!-- Subtle bottom accent line -->
      <line x1="${size * 0.3}" y1="${size * 0.88}" 
            x2="${size * 0.7}" y2="${size * 0.88}" 
            stroke="rgba(255,255,255,0.3)" 
            stroke-width="${size * 0.005}" 
            stroke-linecap="round"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
}

async function generateIcons() {
  console.log('✨ Creating STUNNING app icons with premium SWF branding...\n');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    console.log(`🎨 Generating gorgeous ${size}x${size} icon...`);
    await createIcon(size, outputPath);
  }
  
  // Create favicon
  console.log('🎨 Generating favicon...');
  await sharp(path.join(outputDir, 'icon-192x192.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon.ico'));
  
  console.log('\n✅ All icons created successfully!');
  console.log('🎉 Premium gradient icons with elegant SWF branding!');
  console.log('💎 Modern shopping bag design with glow effects!');
  console.log('⚡ Professional aesthetic that stands out!');
}

generateIcons().catch(console.error);
