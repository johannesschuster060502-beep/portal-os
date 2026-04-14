/**
 * generate-installer-images.js
 * Generates StudoX-branded NSIS installer images for Portal OS.
 *
 * Outputs:
 *   resources/installer-sidebar.bmp  — 164×314 (Welcome/Finish pages left image)
 *   resources/installer-header.bmp   — 150×57  (Header for all inner installer pages)
 *
 * Run:  node scripts/generate-installer-images.js
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const RESOURCES = path.join(__dirname, '../resources')
const ICON = path.join(RESOURCES, 'icon.png')

async function genSidebar() {
  // Base: dark gradient background 164×314
  const svgBase = `
  <svg xmlns="http://www.w3.org/2000/svg" width="164" height="314">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#0d0b14"/>
        <stop offset="100%" stop-color="#080808"/>
      </linearGradient>
      <linearGradient id="glow" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%"   stop-color="#7c6af7" stop-opacity="0.18"/>
        <stop offset="60%"  stop-color="#7c6af7" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="164" height="314" fill="url(#bg)"/>
    <!-- Bottom purple glow -->
    <rect width="164" height="160" y="154" fill="url(#glow)"/>
    <!-- Subtle grid lines -->
    <line x1="0" y1="80"  x2="164" y2="80"  stroke="rgba(124,106,247,0.06)" stroke-width="1"/>
    <line x1="0" y1="160" x2="164" y2="160" stroke="rgba(124,106,247,0.06)" stroke-width="1"/>
    <line x1="0" y1="240" x2="164" y2="240" stroke="rgba(124,106,247,0.06)" stroke-width="1"/>
    <line x1="82" y1="0"  x2="82"  y2="314" stroke="rgba(124,106,247,0.04)" stroke-width="1"/>
    <!-- Right accent border -->
    <rect x="162" y="0" width="2" height="314" fill="rgba(124,106,247,0.35)"/>
    <!-- Top accent line -->
    <rect x="0" y="0" width="162" height="2" fill="rgba(124,106,247,0.2)"/>
    <!-- Hexagon glyph (decorative) -->
    <text x="82" y="110" font-family="Arial" font-size="42" fill="rgba(124,106,247,0.08)"
          text-anchor="middle" dominant-baseline="middle">⬡</text>
    <!-- Product name -->
    <text x="20" y="252" font-family="Arial, sans-serif" font-size="15" font-weight="700"
          fill="white" letter-spacing="1">Portal OS</text>
    <!-- StudoX badge -->
    <rect x="20" y="260" width="58" height="14" rx="2" fill="rgba(124,106,247,0.18)"
          stroke="rgba(124,106,247,0.35)" stroke-width="0.5"/>
    <text x="49" y="271" font-family="Arial, sans-serif" font-size="7.5" font-weight="600"
          fill="rgba(124,106,247,0.95)" text-anchor="middle" letter-spacing="1.5">BY STUDOX</text>
    <!-- Tagline -->
    <text x="20" y="293" font-family="Arial, sans-serif" font-size="7" fill="rgba(255,255,255,0.25)"
          letter-spacing="1.2">FOCUS IS AN ENVIRONMENT</text>
    <!-- Version hint -->
    <text x="20" y="306" font-family="Arial, sans-serif" font-size="7" fill="rgba(255,255,255,0.15)"
          letter-spacing="0.5">v1.0.4 · MIT</text>
  </svg>`

  const svgBuf = Buffer.from(svgBase)

  // If icon exists, composite it centered in the upper half
  let pipeline = sharp(svgBuf)

  if (fs.existsSync(ICON)) {
    const iconResized = await sharp(ICON)
      .resize(52, 52, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    pipeline = sharp(svgBuf).composite([
      { input: iconResized, top: 50, left: Math.round((164 - 52) / 2) }
    ])
  }

  await pipeline.toFile(path.join(RESOURCES, 'installer-sidebar.bmp'))
  console.log('  ✓ installer-sidebar.bmp (164×314)')
}

async function genHeader() {
  const svgHeader = `
  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="57">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#0d0b14"/>
        <stop offset="100%" stop-color="#080808"/>
      </linearGradient>
    </defs>
    <rect width="150" height="57" fill="url(#bg)"/>
    <!-- Left accent bar -->
    <rect x="0" y="0" width="3" height="57" fill="rgba(124,106,247,0.7)"/>
    <!-- Bottom accent line -->
    <rect x="0" y="55" width="150" height="2" fill="rgba(124,106,247,0.18)"/>
    <!-- Product name -->
    <text x="16" y="22" font-family="Arial, sans-serif" font-size="13" font-weight="700"
          fill="white" letter-spacing="0.5">Portal OS</text>
    <!-- Subtitle -->
    <text x="16" y="36" font-family="Arial, sans-serif" font-size="8.5" fill="rgba(255,255,255,0.45)"
          letter-spacing="0.3">Immersive Focus Browser</text>
    <!-- StudoX label -->
    <text x="16" y="50" font-family="Arial, sans-serif" font-size="7" font-weight="600"
          fill="rgba(124,106,247,0.8)" letter-spacing="1.8">BY STUDOX</text>
  </svg>`

  const svgBuf = Buffer.from(svgHeader)

  let pipeline = sharp(svgBuf)

  if (fs.existsSync(ICON)) {
    const iconResized = await sharp(ICON)
      .resize(36, 36, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    pipeline = sharp(svgBuf).composite([
      { input: iconResized, top: Math.round((57 - 36) / 2), left: 107 }
    ])
  }

  await pipeline.toFile(path.join(RESOURCES, 'installer-header.bmp'))
  console.log('  ✓ installer-header.bmp (150×57)')
}

async function main() {
  console.log('Generating Portal OS installer images...')
  await genSidebar()
  await genHeader()
  console.log('Done.')
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
