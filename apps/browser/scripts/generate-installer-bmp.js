#!/usr/bin/env node
/**
 * Portal OS — Installer Branding Bitmaps
 *
 * Generates:
 *   resources/installer-sidebar.bmp  (164×314 — NSIS welcome page sidebar)
 *   resources/installer-header.bmp   (150×57 — NSIS inner page header)
 *
 * Both use the Portal OS dark aesthetic with violet hexagon glyph.
 * NSIS requires BMP format (not PNG), 24-bit or less.
 *
 * Built by JohannesAFK (StudoX)
 */

const sharp = require('sharp')
const path = require('path')

const resourcesDir = path.join(__dirname, '..', 'resources')

// Sidebar bitmap — 164×314
const sidebarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="164" height="314" viewBox="0 0 164 314">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9585f9"/>
      <stop offset="100%" stop-color="#7c6af7"/>
    </linearGradient>
  </defs>
  <rect width="164" height="314" fill="url(#bg)"/>

  <!-- Hexagon glyph centered at upper third -->
  <polygon
    points="82,85 126,110 126,162 82,187 38,162 38,110"
    fill="none"
    stroke="url(#accent)"
    stroke-width="3"
    stroke-linejoin="round"
  />
  <circle cx="82" cy="136" r="5" fill="url(#accent)" opacity="0.9"/>

  <!-- PORTAL OS text -->
  <text
    x="82"
    y="220"
    text-anchor="middle"
    font-family="Segoe UI, Helvetica, Arial, sans-serif"
    font-size="13"
    font-weight="300"
    fill="rgba(255,255,255,0.9)"
    letter-spacing="2"
  >PORTAL OS</text>
  <text
    x="82"
    y="238"
    text-anchor="middle"
    font-family="Segoe UI, Helvetica, Arial, sans-serif"
    font-size="9"
    fill="rgba(255,255,255,0.25)"
    letter-spacing="1.5"
  >v1.0.0</text>

  <!-- Bottom thin accent line -->
  <line x1="20" y1="285" x2="144" y2="285" stroke="rgba(124,106,247,0.2)" stroke-width="1"/>
  <text
    x="82"
    y="300"
    text-anchor="middle"
    font-family="Segoe UI, Helvetica, Arial, sans-serif"
    font-size="8"
    fill="rgba(255,255,255,0.15)"
    letter-spacing="1"
  >BUILT BY JOHANNESAFK</text>
</svg>
`

// Header bitmap — 150×57
const headerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="57" viewBox="0 0 150 57">
  <defs>
    <linearGradient id="accent2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9585f9"/>
      <stop offset="100%" stop-color="#7c6af7"/>
    </linearGradient>
  </defs>
  <rect width="150" height="57" fill="#050505"/>

  <!-- Small hexagon on left -->
  <polygon
    points="28,15 44,24 44,42 28,51 12,42 12,24"
    fill="none"
    stroke="url(#accent2)"
    stroke-width="2"
    stroke-linejoin="round"
  />
  <circle cx="28" cy="33" r="2.5" fill="url(#accent2)" opacity="0.9"/>

  <!-- Text -->
  <text
    x="56"
    y="32"
    font-family="Segoe UI, Helvetica, Arial, sans-serif"
    font-size="11"
    font-weight="500"
    fill="rgba(255,255,255,0.9)"
    letter-spacing="1.5"
  >PORTAL OS</text>
  <text
    x="56"
    y="44"
    font-family="Segoe UI, Helvetica, Arial, sans-serif"
    font-size="8"
    fill="rgba(255,255,255,0.3)"
  >Setup Wizard</text>
</svg>
`

/**
 * Write a 24-bit uncompressed BMP file from raw RGB pixel data.
 * BMP is bottom-up row order, with each row padded to 4-byte alignment.
 */
function writeBmp(filePath, width, height, rgbBuffer) {
  const fs = require('fs')
  const rowSize = width * 3
  const padding = (4 - (rowSize % 4)) % 4
  const paddedRowSize = rowSize + padding
  const pixelArraySize = paddedRowSize * height
  const fileSize = 54 + pixelArraySize

  const buf = Buffer.alloc(fileSize)

  // BMP header (14 bytes)
  buf.write('BM', 0, 'ascii')
  buf.writeUInt32LE(fileSize, 2)
  buf.writeUInt32LE(0, 6)
  buf.writeUInt32LE(54, 10) // pixel data offset

  // DIB header (40 bytes — BITMAPINFOHEADER)
  buf.writeUInt32LE(40, 14)
  buf.writeInt32LE(width, 18)
  buf.writeInt32LE(height, 22)
  buf.writeUInt16LE(1, 26) // planes
  buf.writeUInt16LE(24, 28) // bits per pixel
  buf.writeUInt32LE(0, 30) // no compression
  buf.writeUInt32LE(pixelArraySize, 34)
  buf.writeInt32LE(2835, 38) // X pixels per meter (72 DPI)
  buf.writeInt32LE(2835, 42)
  buf.writeUInt32LE(0, 46)
  buf.writeUInt32LE(0, 50)

  // Pixel data — bottom-up, BGR order
  let offset = 54
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 3
      // Source is RGB, BMP wants BGR
      buf.writeUInt8(rgbBuffer[srcIdx + 2], offset++) // B
      buf.writeUInt8(rgbBuffer[srcIdx + 1], offset++) // G
      buf.writeUInt8(rgbBuffer[srcIdx], offset++) // R
    }
    for (let p = 0; p < padding; p++) {
      buf.writeUInt8(0, offset++)
    }
  }

  fs.writeFileSync(filePath, buf)
}

async function svgToBmp(svg, width, height, outPath) {
  // Rasterize SVG → raw RGB pixels via sharp
  const { data, info } = await sharp(Buffer.from(svg))
    .resize(width, height)
    .flatten({ background: { r: 5, g: 5, b: 5 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  writeBmp(outPath, info.width, info.height, data)
}

async function main() {
  console.log('⬡ Portal OS — Generating installer BMPs')
  console.log('─'.repeat(45))

  try {
    await svgToBmp(sidebarSvg, 164, 314, path.join(resourcesDir, 'installer-sidebar.bmp'))
    console.log('✓ resources/installer-sidebar.bmp (164×314 24-bit BMP)')

    await svgToBmp(headerSvg, 150, 57, path.join(resourcesDir, 'installer-header.bmp'))
    console.log('✓ resources/installer-header.bmp (150×57 24-bit BMP)')
  } catch (err) {
    console.error('Failed:', err)
    process.exit(1)
  }

  console.log('─'.repeat(45))
  console.log('Done.')
}

main()
