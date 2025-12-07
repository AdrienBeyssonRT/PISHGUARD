import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhishGuard - Protection Anti-Phishing',
  description: 'SaaS de sensibilisation et détection du phishing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}


