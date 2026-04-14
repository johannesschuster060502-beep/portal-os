# Portal OS — Code Signing Guide

## Why Code Signing Matters

Without code signing:
- **Windows**: SmartScreen shows "Windows protected your PC" warning
- **macOS**: Gatekeeper blocks the app entirely ("cannot be opened because the developer cannot be verified")

For early beta testing, you can skip signing. Inform beta users how to bypass these warnings.

## Windows Code Signing

### Requirements
- EV Code Signing Certificate (~$400/year)
- Recommended providers: DigiCert, Sectigo, GlobalSign

### Setup
1. Purchase an EV code signing certificate
2. Export as `.pfx` file
3. Base64-encode it: `base64 -i certificate.pfx -o certificate.txt`
4. Add to GitHub repo secrets:
   - `WINDOWS_CERTIFICATE`: the base64-encoded .pfx content
   - `WINDOWS_CERTIFICATE_PASSWORD`: the certificate password

5. Uncomment in `electron-builder.yml`:
   ```yaml
   win:
     signingHashAlgorithms:
       - sha256
   ```

6. Uncomment in `.github/workflows/build-release.yml`:
   ```yaml
   CSC_LINK: ${{ secrets.WINDOWS_CERTIFICATE }}
   CSC_KEY_PASSWORD: ${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}
   ```

## macOS Code Signing + Notarization

### Requirements
- Apple Developer account ($99/year)
- Developer ID Application certificate
- App-specific password for notarization

### Setup
1. Enroll at https://developer.apple.com
2. Create a "Developer ID Application" certificate in Xcode
3. Export as `.p12` file
4. Base64-encode it: `base64 -i certificate.p12 -o certificate.txt`
5. Create an app-specific password at https://appleid.apple.com
6. Add to GitHub repo secrets:
   - `MAC_CERTIFICATE`: base64-encoded .p12
   - `MAC_CERTIFICATE_PASSWORD`: certificate password
   - `APPLE_ID`: your Apple ID email
   - `APPLE_APP_SPECIFIC_PASSWORD`: the app-specific password
   - `APPLE_TEAM_ID`: your team ID (found in Apple Developer portal)

7. Uncomment in `electron-builder.yml`:
   ```yaml
   mac:
     notarize:
       teamId: YOUR_TEAM_ID
   ```

8. Uncomment in `.github/workflows/build-release.yml` the macOS env vars

## Releasing a New Version

```bash
# 1. Bump version (updates both root and browser package.json)
pnpm version:patch   # 1.0.0 → 1.0.1
pnpm version:minor   # 1.0.0 → 1.1.0
pnpm version:major   # 1.0.0 → 2.0.0

# 2. Commit the version bump
git add -A
git commit -m "release: v1.0.1"

# 3. Tag and push — this triggers the GitHub Actions build
git tag v1.0.1
git push origin main --tags
```

The CI workflow will:
1. Build for Windows, macOS, and Linux in parallel
2. Sign the binaries (if certificates are configured)
3. Upload installers to the GitHub Release
4. electron-updater will detect the new release and notify users

## Beta Distribution (No Code Signing)

For beta without code signing:

**Windows users**: Right-click installer → Properties → Unblock → Run anyway
**macOS users**: System Settings → Privacy & Security → "Open Anyway"

---

Portal OS — Built by JohannesAFK (StudoX)
