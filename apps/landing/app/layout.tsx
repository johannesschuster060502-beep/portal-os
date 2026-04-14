import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

export const metadata: Metadata = {
  title: 'Portal OS — Der Browser, der anders denkt',
  description:
    'Ein immersiver Chromium-basierter Desktop-Browser mit cinematischer 3D-Oberfläche. Entwickelt von JohannesAFK (StudoX). Download für Windows, macOS und Linux.',
  keywords: ['browser', 'desktop browser', 'chromium', 'electron', 'portal os', '3d browser'],
  authors: [{ name: 'JohannesAFK (StudoX)' }],
  openGraph: {
    title: 'Portal OS',
    description: 'Der Browser, der anders denkt.',
    type: 'website',
    siteName: 'Portal OS'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal OS',
    description: 'Der Browser, der anders denkt.'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
