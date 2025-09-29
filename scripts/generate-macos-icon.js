#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// macOS Big Sur squircle specifications
const SQUIRCLE_SPECS = {
  1024: {
    contentSize: 824,
    cornerRadius: 185.4,
    gutter: 100,
    shadowRadius: 28,
    shadowOffset: 12
  },
  512: {
    contentSize: 412,
    cornerRadius: 92.7,
    gutter: 50,
    shadowRadius: 14,
    shadowOffset: 6
  },
  256: {
    contentSize: 206,
    cornerRadius: 46.35,
    gutter: 25,
    shadowRadius: 7,
    shadowOffset: 3
  },
  128: {
    contentSize: 103,
    cornerRadius: 23.175,
    gutter: 12.5,
    shadowRadius: 3.5,
    shadowOffset: 1.5
  }
};

async function createSquircleIcon(inputPath, outputSize) {
  const spec = SQUIRCLE_SPECS[outputSize] || SQUIRCLE_SPECS[1024];
  const scale = outputSize / 1024;

  // Adjust specs for the target size
  const contentSize = Math.round(spec.contentSize * scale);
  const cornerRadius = Math.round(spec.cornerRadius * scale);
  const gutter = Math.round(spec.gutter * scale);

  // Create a rounded rectangle SVG mask for the squircle shape
  // Using a superellipse approximation for the squircle
  const squirclePath = `
    <svg width="${outputSize}" height="${outputSize}">
      <defs>
        <mask id="squircle">
          <rect width="${outputSize}" height="${outputSize}" fill="white" rx="${cornerRadius}" ry="${cornerRadius}" />
        </mask>
      </defs>
      <rect width="${outputSize}" height="${outputSize}" fill="white" mask="url(#squircle)" />
    </svg>
  `;

  try {
    // Read and resize the original icon to fit within content area
    const resizedIcon = await sharp(inputPath)
      .resize(contentSize, contentSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Create the final icon with padding and rounded corners
    const roundedIcon = await sharp({
      create: {
        width: outputSize,
        height: outputSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: resizedIcon,
        top: gutter,
        left: gutter
      }])
      .toBuffer();

    // Apply the squircle mask
    const finalIcon = await sharp(roundedIcon)
      .composite([{
        input: Buffer.from(squirclePath),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    return finalIcon;
  } catch (error) {
    console.error(`Error processing icon for size ${outputSize}:`, error);
    throw error;
  }
}

async function generateMacOSIcons() {
  const inputIcon = path.join(__dirname, '..', 'src-tauri', 'icons', 'icon.png');
  const outputDir = path.join(__dirname, '..', 'src-tauri', 'icons');

  console.log('Generating macOS squircle icons...');

  try {
    // Generate different sizes
    const sizes = [
      { size: 1024, name: 'icon.png' },
      { size: 512, name: '512x512.png' },
      { size: 512, name: 'icon.png', folder: 'macos' },
      { size: 256, name: '128x128@2x.png' },
      { size: 128, name: '128x128.png' },
      { size: 64, name: '32x32@2x.png' },
      { size: 32, name: '32x32.png' }
    ];

    for (const { size, name, folder } of sizes) {
      const icon = await createSquircleIcon(inputIcon, size);
      const outputPath = folder
        ? path.join(outputDir, folder, name)
        : path.join(outputDir, name);

      // Ensure directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, icon);

      console.log(`✓ Generated ${outputPath} (${size}x${size})`);
    }

    console.log('\n✅ All macOS icons generated successfully!');
    console.log('\nNow run: bun tauri icon src-tauri/icons/icon.png');
    console.log('This will regenerate the .icns file with the rounded corners.');

  } catch (error) {
    console.error('Failed to generate icons:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMacOSIcons();
}