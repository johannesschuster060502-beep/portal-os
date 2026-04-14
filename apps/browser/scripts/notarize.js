/**
 * Portal OS — macOS Notarization hook
 *
 * Called by electron-builder after code signing on macOS.
 * Only runs when APPLE_ID is set in env (CI environment with credentials).
 * In dev or on Windows/Linux: no-op.
 *
 * Built by JohannesAFK (StudoX)
 */

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  // Skip on non-macOS platforms
  if (electronPlatformName !== 'darwin') return

  // Skip when no credentials present (dev environment)
  if (!process.env.APPLE_ID) {
    console.log('⬡ Portal OS — notarization skipped (no APPLE_ID set)')
    return
  }

  // Lazy-import so CI doesn't need @electron/notarize installed in dev
  let notarize
  try {
    ;({ notarize } = require('@electron/notarize'))
  } catch {
    console.warn('⬡ Portal OS — @electron/notarize not installed, skipping')
    return
  }

  const appName = context.packager.appInfo.productFilename

  console.log(`⬡ Portal OS — notarizing ${appName}.app...`)

  await notarize({
    tool: 'notarytool',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  })

  console.log('⬡ Portal OS — notarization complete.')
}
