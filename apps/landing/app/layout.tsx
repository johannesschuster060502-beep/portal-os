import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portal OS — The Browser That Thinks Differently',
  description:
    'An immersive Chromium-based desktop browser with a cinematic 3D interface. Built by JohannesAFK (StudoX). Download for Windows, macOS, and Linux.',
  keywords: ['browser', 'desktop browser', 'chromium', 'electron', 'portal os', '3d browser'],
  authors: [{ name: 'JohannesAFK (StudoX)' }],
  openGraph: {
    title: 'Portal OS',
    description: 'The browser that thinks differently.',
    type: 'website',
    siteName: 'Portal OS'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal OS',
    description: 'The browser that thinks differently.'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
