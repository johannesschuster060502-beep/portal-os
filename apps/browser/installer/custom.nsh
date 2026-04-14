; Portal OS — Custom NSIS Installer Script
; Built by JohannesAFK (StudoX)
;
; This script adds:
;   - Custom branding text
;   - portalos:// protocol handler registration
;   - Default browser capability registration
;   - Clean uninstall (removes registry keys)

!macro customHeader
  BrandingText "Portal OS — Built by JohannesAFK"
!macroend

!macro customInstall
  ; Register portalos:// protocol handler
  WriteRegStr HKCU "Software\Classes\portalos" "" "URL:Portal OS Protocol"
  WriteRegStr HKCU "Software\Classes\portalos" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\portalos\DefaultIcon" "" "$INSTDIR\Portal OS.exe,0"
  WriteRegStr HKCU "Software\Classes\portalos\shell\open\command" "" '"$INSTDIR\Portal OS.exe" "%1"'

  ; Register as a possible default browser
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\PortalOS" "" "Portal OS"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\PortalOS\Capabilities" "ApplicationName" "Portal OS"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\PortalOS\Capabilities" "ApplicationDescription" "Portal OS — Immersive Chromium-Based Desktop Browser"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\PortalOS\Capabilities\URLAssociations" "http" "PortalOSURL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\PortalOS\Capabilities\URLAssociations" "https" "PortalOSURL"
  WriteRegStr HKCU "Software\Classes\PortalOSURL" "" "Portal OS HTML Document"
  WriteRegStr HKCU "Software\Classes\PortalOSURL\DefaultIcon" "" "$INSTDIR\Portal OS.exe,0"
  WriteRegStr HKCU "Software\Classes\PortalOSURL\shell\open\command" "" '"$INSTDIR\Portal OS.exe" "%1"'
!macroend

!macro customUnInstall
  ; Clean up registry
  DeleteRegKey HKCU "Software\Classes\portalos"
  DeleteRegKey HKCU "Software\Classes\PortalOSURL"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\PortalOS"
!macroend
